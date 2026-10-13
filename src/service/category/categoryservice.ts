import { http } from "@/lib/axios/axios_instance";

export interface PostCategory {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryPayload {
  title: string;
}

export const allCategory = async (): Promise<PostCategory[]> => {
  const response = await http.httpget<PostCategory[]>("/category/show");
  return response.data;
};

export const getCategoryById = async (id: string): Promise<PostCategory> => {
  const response = await http.httpget<PostCategory>("/category/show-by-id", {
    params: { id },
  });
  return response.data;
};

export const createCategory = async (
  payload: CategoryPayload,
): Promise<PostCategory> => {
  const response = await http.httpPost<PostCategory>(
    "/category/create",
    payload,
  );
  return response.data;
};

export const updateCategory = async (
  id: string,
  payload: CategoryPayload,
): Promise<PostCategory> => {
  const response = await http.httpUpdate<PostCategory>(
    "/category/update",
    payload,
    { params: { id } },
  );
  return response.data;
};

export const deleteCategory = async (id: string): Promise<PostCategory> => {
  const response = await http.httpDelete<PostCategory>("/category/delete", {
    params: { id },
  });
  return response.data;
};
