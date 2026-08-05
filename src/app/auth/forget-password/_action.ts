"use server"
import { http } from "@/lib/axios/axios_instance"
import { redirect } from "next/navigation";



export const OTPdSenderForForgetPassword = async (email: string) => {
  console.log(email)
  const resposnse = await http.httpPost("/auth/forget-password", { email });
  if (!resposnse.success) {
    throw new Error(resposnse.message);
  }
  redirect(`/auth/reset-password?email=${email}`)
 
}