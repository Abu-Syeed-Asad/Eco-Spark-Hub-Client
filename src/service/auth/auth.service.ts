import { http } from "@/lib/axios/axios_instance";
import { cookieUtils } from "@/lib/cookie/cookieUtils";
import { cookies } from "next/headers";
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getNewTokenWithRefreshToken = async (refreshToken: string) => {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}`,
      },
    });
    if (!res.ok) {
      return false;
    }
    const { data } = await res.json();
    const { accessToken, refreshToken: newRefreshToken, token } = data;
    if (accessToken) {
      await cookieUtils.setCookie("access_token", accessToken);
    }
    if (newRefreshToken) {
      await cookieUtils.setCookie("refresh_token", newRefreshToken);
    }
    if (token) {
      await cookieUtils.setCookie("session_token", token, 24 * 60 * 60);
    }
    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("access_token")?.value;
    const sessionToken = cookieStore.get("session_token")?.value;
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
