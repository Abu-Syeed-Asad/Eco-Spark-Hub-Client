"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardAllpost } from "@/service/dashboard/allPost";

import DashboardCharts, {
  DashboardStatsCards,
  type UserDashboardResponse,
} from "./DashboardCharts";

const UserDashBoardContent = () => {
  const { data } = useQuery<UserDashboardResponse>({
    queryKey: ["dasboard-data"],
    queryFn: () => getDashboardAllpost<UserDashboardResponse>(),
  });

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <DashboardStatsCards data={data} role="user" />
      <DashboardCharts data={data} role="user" />
    </div>
  );
};

export default UserDashBoardContent;
