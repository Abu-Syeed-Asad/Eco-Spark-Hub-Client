"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DashboardResponse } from "./AdminDasboardContent";

const AdminDashboardStateCard = () => {
  const queryClient = useQueryClient();

  const dashboardData = queryClient.getQueryData<DashboardResponse>([
    "dashboard-data",
  ]);

  const dashboard = dashboardData?.adminDashboardPost;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5 text-center">
      <div className="rounded-xl border p-5">
        <p className="text-sm text-muted-foreground">Approved Posts</p>
        <h2 className="text-3xl font-bold">
          {dashboard?.ApprovedPost ?? 0}
        </h2>
      </div>

      <div className="rounded-xl border p-5">
        <p className="text-sm text-muted-foreground">Drafted Posts</p>
        <h2 className="text-3xl font-bold">
          {dashboard?.countDraftedPost ?? 0}
        </h2>
      </div>

      <div className="rounded-xl border p-5">
        <p className="text-sm text-muted-foreground">Free Posts</p>
        <h2 className="text-3xl font-bold">
          {dashboard?.freePost ?? 0}
        </h2>
      </div>

      <div className="rounded-xl border p-5">
        <p className="text-sm text-muted-foreground">Paid Posts</p>
        <h2 className="text-3xl font-bold">
          {dashboard?.paidPost ?? 0}
        </h2>
      </div>

      <div className="rounded-xl border p-5">
        <p className="text-sm text-muted-foreground">Own Posts</p>
        <h2 className="text-3xl font-bold">
          {dashboard?.totalPost ?? 0}
        </h2>
      </div>

    </div>
  );
};

export default AdminDashboardStateCard;