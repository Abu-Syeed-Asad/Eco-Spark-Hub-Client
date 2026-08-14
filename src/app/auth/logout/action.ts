"use server";

import { http } from "@/lib/axios/axios_instance";
import { cookieUtils } from "@/lib/cookie/cookieUtils";
import { redirect } from "next/navigation";

export const logoutAction = async () => {
  try {
    await http.httpPost("/auth/log-out");
  } catch (error) {
    console.log("Logout error:", error);
  } finally {
    // Always delete cookies even if request fails
    await cookieUtils.deleteCookie("access_token");
    await cookieUtils.deleteCookie("refresh_token");
    await cookieUtils.deleteCookie("session_token");
  }

  // Redirect to login page
  redirect("/auth/login");
};
