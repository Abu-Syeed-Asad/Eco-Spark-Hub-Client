import { http } from "@/lib/axios/axios_instance";
import type { IUser } from "@/types/auth.type";

export interface IUserUpdatePayload {
  name?: string;
  phone?: string | null;
  image?: string | null;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface PaymentMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaymentGatewayData {
  [key: string]: unknown;
}

export interface PaymentUser {
  id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}

export interface PaymentPost {
  id: string;
  title?: string;
  [key: string]: unknown;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  transactionId: string;
  stripeEventId: string;
  status: string;
  invoiceUrl: string;
  paymentGatewayData: PaymentGatewayData;
  createdAt: string;
  updatedAt: string;
  postId: string;
  userId: string;
  user: PaymentUser;
  post: PaymentPost;
  [key: string]: unknown;
}

export interface PaymentListResponse {
  data: PaymentRecord[];
  meta?: PaymentMeta;
}

type PaymentResponsePayload = PaymentListResponse | PaymentRecord[];

const normalizePaymentResponse = (
  payload: PaymentResponsePayload,
): PaymentListResponse =>
  Array.isArray(payload) ? { data: payload } : { ...payload, data: payload.data ?? [] };

export async function updateUserProfile(payload: IUserUpdatePayload) {
  try {
    const res = await http.httpUpdate<IUser>("/auth/profile-update", payload);

    return res.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
}
export async function changePassword(payload: IChangePasswordPayload) {
  try {
    const res = await http.httpUpdate<IUser>("/auth/change-password", payload);

    return res.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}

export async function allPayment(): Promise<PaymentListResponse> {
  try {
    const res = await http.httpget<PaymentResponsePayload>("/payment/all-payment");

    return normalizePaymentResponse(res.data);
  } catch (error) {
    console.error("Error fetching payment data:", error);
    throw error;
  }
}
export async function MyPayment(): Promise<PaymentListResponse> {
  try {
    const res = await http.httpget<PaymentResponsePayload>("/payment/my-payment");

    return normalizePaymentResponse(res.data);
  } catch (error) {
    console.error("Error fetching payment data:", error);
    throw error;
  }
}
