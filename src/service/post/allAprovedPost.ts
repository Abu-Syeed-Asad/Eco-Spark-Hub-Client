import { http } from "@/lib/axios/axios_instance";
import type { Post, PostCategory, PostStatus, PostType } from "@/types/post";

export type UpdatePostPayload = {
  title: string;
  description: string;
  photo: string;
  postType: PostType;
  taka: number;
  categoryId: string;
};

/** Content fields a post owner is allowed to update. */
export type UpdateOwnPostPayload = UpdatePostPayload;

export type CreatePostPayload = UpdatePostPayload & {
  userId: string;
};

/** Workflow field an administrator is allowed to update. */
export type UpdatePostStatusPayload = {
  status: Extract<PostStatus, "DRAFT" | "APPROVED" | "REJECTED">;
};

export const createPost = async (payload: CreatePostPayload): Promise<Post> => {
  const response = await http.httpPost<Post>("/post/create", payload);
  return response.data;
};

export const createPostByUser = createPost;

export const allApprovedPost = async (): Promise<Post[]> => {
  const response = await http.httpget("/post/all-post");

  return response.data as Post[];
};

export const getPostById = async (id: string): Promise<Post> => {
  const response = await http.httpget(`/post/${id}`);
  return response.data as Post;
};

export const getMyPosts = async (): Promise<Post[]> => {
  const response = await http.httpget<Post[]>("/post/my-post");
  return response.data;
};

export const getPostCategories = async (): Promise<PostCategory[]> => {
  const response = await http.httpget<PostCategory[]>("/category/all-category");
  return response.data;
};

export const updatePost = async (
  id: string,
  payload: UpdateOwnPostPayload,
): Promise<Post> => {
  const response = await http.httpUpdate<Post>(`/post/update/${id}`, payload);

  return response.data;
};

export const updatePostStatus = async (
  id: string,
  payload: UpdatePostStatusPayload,
): Promise<Post> => {
  const response = await http.httpUpdate<Post>(`/post/update/${id}`, payload);
  return response.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await http.httpDelete(`/post/${id}`);
};
