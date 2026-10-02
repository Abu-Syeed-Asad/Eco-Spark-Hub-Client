"use client"

import DraftedPostTable from '@/components/module/AllPost/AdminDashBoardAllPost';

import { getDashboardAllpost } from '@/service/dashboard/allPost';
import { useQuery } from '@tanstack/react-query';
import type { AdminDashboardResponse } from '@/types/dashboard.type';

const AllPost = () => {
  const { data, error, isLoading } = useQuery<AdminDashboardResponse>({
    queryKey: ["dashboard-all-posts"],
    queryFn: () => getDashboardAllpost<AdminDashboardResponse>(),
  });

  if (isLoading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p className="text-destructive">Unable to load posts.</p>;
  }

  return (
    <div className="p-4 sm:p-6">
      <DraftedPostTable posts={data?.adminDashboardPost.DraftedPost ?? []} />
    </div>
  );
};

export default AllPost;
