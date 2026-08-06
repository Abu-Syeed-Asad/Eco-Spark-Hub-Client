"use server";
import { http } from "@/lib/axios/axios_instance";
import { AuthResponse } from "@/types/auth.type";
import { LoginType } from "@/validation/auth/login.schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken"

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
console.log(data)
  if (!data.accessToken) {
    throw new Error("Login failed");
  }

  if (!data.user.emailVerified) {
    redirect(`/auth/verify-email?email=${encodeURIComponent(data.user.email)}`);
  }
  if (data.accessToken) {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", data.accessToken);
    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge:60*60*24*7
    });
    cookieStore.set("token", data.token);
  }

  const accesstokensecret:string = process.env.ACCESS_TOKEN_SECRET as string
  // role wise authentication
  const tokenverify = jwt.verify(data.accessToken, accesstokensecret) as JwtPayload;
  console.log(tokenverify)
  
  // if (tokenverify.role==="ADMIN") {
  //    redirect(redirectPath || "/dashboard/admin");
  // }
  console.log(redirect, "redirect path form login action")
  redirect(redirectPath || "/dashboard");
};
