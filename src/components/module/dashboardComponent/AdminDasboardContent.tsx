"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardAllpost } from "@/service/dashboard/allPost";

import DashboardCharts, {
  DashboardStatsCards,
  type AdminDashboardResponse,
} from "./DashboardCharts";

const AdminDasboardContent = () => {
  const { data } = useQuery<AdminDashboardResponse>({
    queryKey: ["dasboard-data"],
    queryFn: () => getDashboardAllpost<AdminDashboardResponse>(),
  });

  console.log(data)

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <DashboardStatsCards data={data} role="admin" />
      <DashboardCharts data={data} role="admin" />
    </div>
  );
};

export default AdminDasboardContent;
