"use server"
import { http } from "@/lib/axios/axios_instance";

export const getDashboardAllpost = async () => {
  const res = await http.httpget("/post/dashbord-post");
  return res.data;
};
