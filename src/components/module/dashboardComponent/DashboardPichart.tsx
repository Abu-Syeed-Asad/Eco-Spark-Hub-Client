"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { ChartData } from "./DashboardCharts";

const COLORS = ["#2563eb", "#f59e0b", "#10b981", "#8b5cf6"];

type DashboardPichartProps = {
  data?: ChartData[];
};

/** @deprecated Use DashboardCharts directly for the complete analytics section. */
const DashboardPichart = ({ data = [] }: DashboardPichartProps) => {
  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardPichart;
