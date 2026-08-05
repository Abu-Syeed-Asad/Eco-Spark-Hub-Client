"use server";
import { http } from "@/lib/axios/axios_instance";
import { AuthResponse } from "@/types/auth.type";
import { LoginType } from "@/validation/auth/login.schema";
import { redirect } from "next/navigation";

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
    redirect(`/auth/verify-email?email=${encodeURIComponent(data.user.email)}`);
  }

  redirect(redirectPath || "/dashboard");
};
