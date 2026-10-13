"use server";
import { http } from "@/lib/axios/axios_instance";
import type { Post } from "@/types/post";
export async function getPostDetails(id: string): Promise<Post> {
  return (await http.httpget<Post>(`/post/${encodeURIComponent(id)}`)).data;
}
