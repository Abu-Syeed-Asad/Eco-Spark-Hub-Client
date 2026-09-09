"use server"
import { http } from "@/lib/axios/axios_instance";

export const getDashboardAllUser = async <TData = unknown>(): Promise<TData> => {
  const res = await http.httpget<TData>("/auth/all-user");
  return res.data;
};