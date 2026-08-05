"use server";

import { redirect } from "next/navigation";
import { http } from "@/lib/axios/axios_instance";
import { AuthResponse } from "@/types/auth.type";

export const verifyEmailAction = async (payload: {
  email: string;
   otp: string;
}) => {
  if (!payload.email || !payload.otp) {
    throw new Error("Email and OTP are required.");
  }
  
  const { data } = await http.httpPost<AuthResponse>("/auth/verify", payload);

  if (!data.user.emailVerified) {
    throw new Error(
      "Verification failed. Please check the code and try again.",
    );
  }

  redirect("/dashboard");
};

export const resendVerifyEmailAction = async (payload: { email: string }) => {
  if (!payload.email) {
    throw new Error("Email is required to resend OTP.");
  }

  const { data } = await http.httpPost<{ message: string }>(
    "/auth/resend",
    payload,
  );
  return data;
};
