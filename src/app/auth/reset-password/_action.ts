"use server";

import { redirect } from "next/navigation";
import { http } from "@/lib/axios/axios_instance";

export interface IResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export const resetPassword = async (payload: IResetPasswordPayload) => {
  const normalizedPayload = {
    email: String(payload.email ?? "").trim(),
    otp: String(payload.otp ?? "").replace(/\D/g, ""),
    newPassword: String(payload.newPassword ?? ""),
  };

  if (
    !normalizedPayload.email ||
    !normalizedPayload.otp ||
    !normalizedPayload.newPassword
  ) {
    throw new Error("Email, OTP and new password are required.");
  }

  const response = await http.httpPost<{ message: string }>(
    "/auth/reset-password",
    normalizedPayload,
  );

  if (!response.success) {
    throw new Error(response.message || "Unable to reset password.");
  }
  if (response.success) {
    redirect("/auth/login");
  }
 
};
