"use client"
import { useQuery } from "@tanstack/react-query";
import AdminDashboardStateCard from "./AdminDashboardStateCard";
import { getDashboardAllpost } from "@/service/dashboard/allPost";
export interface AdminDashboardPost {
  ApprovedPost: number;
  DraftedPost: unknown[]; // Replace with Post[] if you have a Post type
  allposts: unknown[];    // Replace with Post[] if you have a Post type
  countDraftedPost: number;
  freePost: number;
  paidPost: number;
  totalPost: number;
}

export interface DashboardResponse {
  adminDashboardPost: AdminDashboardPost;
}

const AdminDasboardContent =  () => {
  const {data,error,isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn:async()=>getDashboardAllpost()
  })
 
  return (
    <div>
      {
        isLoading ? (<> loading ...</>) : (<>
        <AdminDashboardStateCard  />
        </>)

      }
      
    </div>
  );
};

export default AdminDasboardContent;