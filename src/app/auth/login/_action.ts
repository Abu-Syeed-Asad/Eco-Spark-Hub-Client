"use server";
import { http } from "@/lib/axios/axios_instance";
import { AuthResponse } from "@/types/auth.type";
import { LoginType } from "@/validation/auth/login.schema";

import jwt from "jsonwebtoken";
import { cookieUtils } from "@/lib/cookie/cookieUtils";
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  userRole,
} from "@/lib/auth/authUtils";

 export interface JwtPayload {
   userId: string;
   name: string;
   email: string;
   role: string;
   status: string;
   iat: number;
   exp: number;
 }
export const loginUser = async (
  loginPayload: LoginType,
  redirectPath?: string,
) => {
  const { data } = await http.httpPost<AuthResponse>(
    "/auth/login",
    loginPayload,
  );
  if (!data.accessToken) {
    throw new Error("Login failed");
  }

  if (!data.user.emailVerified) {
    return `/auth/verify-email?email=${encodeURIComponent(data.user.email)}`;
  }

  await cookieUtils.setCookie("access_token", data.accessToken);
  await cookieUtils.setCookie("refresh_token", data.refreshToken, 60 * 60 * 24 * 7);
  await cookieUtils.setCookie("session_token", data.token);

  const accesstokensecret: string = process.env.ACCESS_TOKEN_SECRET as string;
  const tokenverify = jwt.verify(data.accessToken, accesstokensecret) as JwtPayload;
  const role = tokenverify.role as userRole;

  return redirectPath && isValidRedirectForRole(redirectPath, role)
    ? redirectPath
    : getDefaultDashboardRoute(role);
};
