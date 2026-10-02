import { http } from "@/lib/axios/axios_instance";
import type { PostCategory } from "@/types/post";

export const allCategory = async (): Promise<PostCategory[]> => {
  const response = await http.httpget<PostCategory[]>("/category/show");
  return response.data;
};
