"use client";

import DashboardCharts, {
  type AdminDashboardResponse,
} from "./DashboardCharts";

type AdminDashboardPiechartProps = {
  data?: AdminDashboardResponse | null;
};

/** @deprecated Use DashboardCharts directly for the complete analytics section. */
const AdminDashboardPiechart = ({ data }: AdminDashboardPiechartProps) => {
  return <DashboardCharts data={data} role="admin" />;
};

export default AdminDashboardPiechart;
