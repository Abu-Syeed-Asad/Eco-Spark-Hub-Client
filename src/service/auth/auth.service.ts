import { cookieUtils } from "@/lib/cookie/cookieUtils";
import { cookies } from "next/headers";
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getNewTokenWithRefreshToken = async (refreshToken: string) => {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    if (!res.ok) {
      return false;
    }
    const { data } = await res.json();
    const { accessToken, refreshToken: newRefreshTokne, token } = data;
    if (accessToken) {
      await cookieUtils.setCookie(accessToken, "access_token");
    }
    if (newRefreshTokne) {
      await cookieUtils.setCookie(newRefreshTokne, "refresh_token");
    }
    if (token) {
      await cookieUtils.setCookie(token, "session_token", 24 * 60 * 60);
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

    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Cookie: cookieParts.join("; "),
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user info:", res.status, res.statusText);

      return null;
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
