export type ROLE = "ADMIN" | "USER" | "MODERATOR" | string;
export type USER_STATUS =
  | "ACTIVE"
  | "INACTIVE"
  | "BLOCKED"
  | "DELETED"
  | string;

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  token: string;
  redirectUrl: boolean;
  user: IUser;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: ROLE;
  status: USER_STATUS;
  phone: string | null;
  needPasswordChange: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  totalAmount: number;
}

export interface IAdminUserUpdatePayload {
  name?: string;
  email?: string;
  phone?: string | null;
  image?: string | null;
  role?: ROLE;
  status?: USER_STATUS;
}
