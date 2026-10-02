export type PostType = "FREE" | "PAID" | "UNPAID";

export type PostStatus = "DRAFT" | "APPROVED" | "REJECTED" | "DELETED";

export interface DashboardPost {
  id: string;
  title: string;
  status?: PostStatus;
  postType?: PostType;
  createdAt?: string;
  category?: {
    id?: string;
    title?: string;
  };
}

export interface AdminDashboardResponse {
  adminDashboardPost: {
    ApprovedPost: number;
    DraftedPost: DashboardPost[];
    allposts: DashboardPost[];
    countDraftedPost: number;
    freePost: number;
    paidPost: number;
    totalPost: number;
  };
}

export interface UserDashboardPostData {
  totalPost?: number;
  allposts?: DashboardPost[];
  countApprovedPost?: number;
  approvedPost?: number | DashboardPost[];
  ApprovedPost?: number | DashboardPost[];
  countRejectedPost?: number;
  RejectPost?: DashboardPost[];
  countDraftedPost?: number;
  draftedPost?: number | DashboardPost[];
  DraftedPost?: number | DashboardPost[];
  countPaidPost?: number;
  paidPost?: number | DashboardPost[];
  countfreePost?: number;
  freePost?: number | DashboardPost[];
}

export interface UserDashboardResponse {
  UserDashBoardPost?: UserDashboardPostData;
  userDashboardPost?: UserDashboardPostData;
}
