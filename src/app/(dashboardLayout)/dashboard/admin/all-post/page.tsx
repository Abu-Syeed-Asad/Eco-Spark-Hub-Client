"use client"

import DraftedPostTable from '@/components/module/AllPost/AdminDashBoardAllPost';

import { getDashboardAllpost } from '@/service/dashboard/allPost';
import { useQuery } from '@tanstack/react-query';
import { AppLoader } from '@/components/ui/app-loader';

type AdminDashboardResponse = {
  adminDashboardPost: {
    DraftedPost: Parameters<typeof DraftedPostTable>[0]['posts'];
  };
};

const AllPost = () => {
  const { data, error, isLoading } = useQuery<AdminDashboardResponse>({
    queryKey: ["dashboard-all-posts"],
    queryFn: () => getDashboardAllpost<AdminDashboardResponse>(),
  });

  if (isLoading) {
    return <AppLoader label="Loading posts..." />;
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
