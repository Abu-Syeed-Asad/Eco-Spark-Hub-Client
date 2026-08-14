"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
const colors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];
type BarChartData = {
  name: string;
  value: number;
};

interface DashboardBarChartProps {
  data: BarChartData[];
}

const DashboardBarChart = ({ data }: DashboardBarChartProps) => {
  return (
    <div className="w-full h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
  {data.map((_, index) => (
    <Cell
      key={`cell-${index}`}
      fill={colors[index % colors.length]}
    />
  ))}
</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardBarChart;