/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import DraftedPostTable from '@/components/module/AllPost/DraftedPostTable';

import { getDashboardAllpost } from '@/service/dashboard/allPost';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const AllPost = () => {
  const { data, error, isLoading } = useQuery<{
    adminDashboardPost?: {
      DraftedPost?: Array<Record<string, unknown>>;
    };
  }>({
    queryKey: ["dashboard-draftedpost"],
    queryFn: async () => getDashboardAllpost() as Promise<{
      adminDashboardPost?: {
        DraftedPost?: Array<Record<string, unknown>>;
      };
    }>,
  });

  return (
    <div>
      {isLoading ? (
        <>
          <p>loading....</p>
        </>
      ) : (
        <>
          <DraftedPostTable posts={((data?.adminDashboardPost?.DraftedPost ?? []) as any)} />
        </>
      )}
    </div>
  );
};

export default AllPost;