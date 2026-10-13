import { http } from "@/lib/axios/axios_instance";
import { cookieUtils } from "@/lib/cookie/cookieUtils";
import { cookies } from "next/headers";
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface RefreshedAuthTokens {
  access_token: string;
  refreshToken: string;
  session_token: string;
}

export const getNewTokenWithRefreshToken = async (
  refreshToken: string,
  sessionToken: string,
): Promise<RefreshedAuthTokens | null> => {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/get-new-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}; session_token=${sessionToken}`,
      },
    });
    if (!res.ok) {
      return null;
    }
    const { data }: { data: RefreshedAuthTokens } = await res.json();
    return data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

export async function getUserInfo(tokens?: {
  accessToken: string;
  sessionToken: string;
}) {
  try {
    const cookieStore = await cookies();

    const accessToken =
      tokens?.accessToken ?? cookieStore.get("access_token")?.value;
    const sessionToken =
      tokens?.sessionToken ?? cookieStore.get("session_token")?.value;
    if (!accessToken || !sessionToken) {
      return null;
    }

    const cookieParts = [
      `access_token=${accessToken}`,
      `session_token=${sessionToken}`,
    ];

    const candidateEndpoints = ["/auth/profile", "/auth/me", "/auth/user"];

    for (const endpoint of candidateEndpoints) {
      const res = await fetch(`${BASE_API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          Cookie: cookieParts.join("; "),
        },
      });

      if (res.ok) {
        const { data } = await res.json();
        return data;
      }

      if (res.status !== 404) {
        break;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
export const logout = async () => {
  try {
    const res = await http.httpPost("/auht/log-out");
    if (!res) {
      throw new Error("Logout failed ");
    }
    cookieUtils.deleteCookie("access_token");
    cookieUtils.deleteCookie("refresh_token");
    cookieUtils.deleteCookie("session_token");
  } catch (error) {
    console.log(error);
  }
};
