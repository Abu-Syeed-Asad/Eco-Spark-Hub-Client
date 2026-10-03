export type PostType = "FREE" | "PAID" | "UNPAID";

export type PostStatus = "DRAFT" | "APPROVED" | "REJECTED" | "UNPAID";

export type UserRole =
  | "ADMIN"
  | "USER"
  | "MODERATOR"
  | string;

export interface PostUser {
  id: string;
  name: string;
  email: string;
  status?: string;
  phone?: string | null;
  role: UserRole;
  needPasswordChange?: boolean;
  isDeleted?: boolean;
  deletedAt?: string | null;
  emailVerified?: boolean;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
  totalAmount?: number;
}

export interface PostCategory {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  photo: string;
  postType: PostType;
  taka: number;
  status: PostStatus;
  userId: string;
  categoryId: string;
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;

  user: PostUser;
  category: PostCategory;
}

export interface IPostInterface {
  title: string;
  description: string;
  photo?: string;
  postType: PostType;
  status: PostStatus;
  userId: string;
  categoryId: string;
  taka: number;
}

export interface PostMeta {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface AllApprovedPostResponse {
  success: boolean;
  message: string;
  data: Post[];
  meta: PostMeta;
}