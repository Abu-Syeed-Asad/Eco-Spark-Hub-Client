"use server";
import { http } from "@/lib/axios/axios_instance";
import type { CommentItem, CommentPage, CreateCommentPayload } from "@/types/comment";
export async function getComments(postId: string, page = 1): Promise<CommentPage> {
  return (await http.httpget<CommentPage>("/comment/show", { params: { id: postId, page, limit: 5 } })).data;
}
export async function createComment(payload: CreateCommentPayload): Promise<CommentItem> {
  return (await http.httpPost<CommentItem>("/comment/create-comment", payload)).data;
}
export async function editComment(id: string, content: string): Promise<CommentItem> {
  return (await http.httpUpdate<CommentItem>("/comment/update", { content }, { params: { id } })).data;
}
export async function deleteComment(id: string): Promise<void> {
  await http.httpDelete("/comment/delete", { params: { id } });
}
