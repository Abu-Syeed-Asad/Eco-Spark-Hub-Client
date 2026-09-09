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
  role: "USER" | "ADMIN" | string;
  status: "ACTIVE" | "DELETED" | "BLOCKED" | string;
  phone: string | null;
  needPasswordChange: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  totalAmount: number;
}
