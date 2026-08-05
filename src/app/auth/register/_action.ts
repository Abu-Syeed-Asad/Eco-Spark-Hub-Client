"use server";
import { http } from "@/lib/axios/axios_instance";
import { AuthResponse } from "@/types/auth.type";
import { RegisterType } from "@/validation/auth/register.schema";
import { redirect } from "next/navigation";

export const RegisterUser = async (payload: RegisterType) => {
  const { data } = await http.httpPost<AuthResponse>("/auth/register", payload);

  if (!data.accessToken) {
    throw new Error("Register Failed");
  }

  if (data.user.emailVerified) {
    redirect("/dashboard");
  }

  redirect(`/auth/verify-email?email=${encodeURIComponent(data.user.email)}`);
};
