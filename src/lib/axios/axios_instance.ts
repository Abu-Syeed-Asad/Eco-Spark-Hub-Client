/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";

const getCookieHeaderFromClient = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const accessToken = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("access_token="))
    ?.split("=")
    .slice(1)
    .join("=");

  const sessionToken = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("session_token="))
    ?.split("=")
    .slice(1)
    .join("=");

  return [
    accessToken ? `access_token=${decodeURIComponent(accessToken)}` : null,
    sessionToken ? `session_token=${decodeURIComponent(sessionToken)}` : null,
  ]
    .filter(Boolean)
    .join("; ");
};

const getCookieHeaderFromServer = async () => {
  if (typeof window !== "undefined") {
    return getCookieHeaderFromClient();
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const sessionToken = cookieStore.get("session_token")?.value;

  return [
    accessToken ? `access_token=${accessToken}` : null,
    sessionToken ? `session_token=${sessionToken}` : null,
  ]
    .filter(Boolean)
    .join("; ");
};

export const axiosInstance = async () => {
  const cookieHeader =
    typeof window !== "undefined"
      ? getCookieHeaderFromClient()
      : await getCookieHeaderFromServer();

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });
};

export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
}

export interface ApiRequestOption {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const httpget = async <TData>(
  endpoint: string,
  options?: ApiRequestOption,
): Promise<ApiResponse<TData>> => {
  const instance = await axiosInstance();
  try {
    const response = await instance.get<ApiResponse<TData>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const httpPost = async <TData>(
  endPoint: string,
  data?: unknown,
  option?: ApiRequestOption,
): Promise<ApiResponse<TData>> => {
  const instance = await axiosInstance();
  try {
    const postResponse = await instance.post<ApiResponse<TData>>(
      endPoint,
      data,
      {
        params: option?.params,
        headers: option?.headers,
      },
    );

    return postResponse.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw new Error(
        typeof error.response.data === "object" &&
          "message" in error.response.data
          ? String((error.response.data as any).message)
          : error.message,
      );
    }

    throw error;
  }
};

const httpDelete = async <TData>(
  endPoint: string,
  option?: ApiRequestOption,
): Promise<ApiResponse<TData>> => {
  const instance = await axiosInstance();
  try {
    const deleteResponse = await instance.delete<ApiResponse<TData>>(endPoint, {
      params: option?.params,
      headers: option?.headers,
    });

    return deleteResponse.data;
  } catch (error) {
    throw error;
  }
};

const httpUpdate = async <TData>(
  endPoint: string,
  data: unknown,
  option?: ApiRequestOption,
): Promise<ApiResponse<TData>> => {
  const instance = await axiosInstance();
  try {
    const updateResponse = await instance.patch<ApiResponse<TData>>(
      endPoint,
      data,
      {
        params: option?.params,
        headers: option?.headers,
      },
    );

    return updateResponse.data;
  } catch (error) {
    throw error;
  }
};

export const http = {
  httpDelete,
  httpPost,
  httpget,
  httpUpdate,
};
