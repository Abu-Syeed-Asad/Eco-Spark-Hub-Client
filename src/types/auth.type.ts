export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  image: string | null;
  phone: string | null;
  needPasswordChange: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  totalAmount?: number;
}

export interface IAdminUserUpdatePayload {
  name?: string;
  email?: string;
  phone?: string | null;
  image?: string | null;
  role?: string;
  status?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  token: string;
  user: Pick<IUser, "id" | "name" | "email" | "emailVerified"> & {
    role?: string;
    status?: string;
    image?: string | null;
  };
}
