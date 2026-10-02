"use server";
import { http } from "@/lib/axios/axios_instance";

export const getDashboardAllpost = async <
  TData = unknown,
>(): Promise<TData> => {
  const res = await http.httpget<TData>("/post/dashbord-post");
  return res.data;
};
