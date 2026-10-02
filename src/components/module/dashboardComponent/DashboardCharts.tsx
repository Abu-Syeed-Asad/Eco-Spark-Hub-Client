"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  AdminDashboardResponse,
  UserDashboardResponse,
} from "@/types/dashboard.type";

export type {
  AdminDashboardResponse,
  DashboardPost,
  PostStatus,
  PostType,
  UserDashboardResponse,
} from "@/types/dashboard.type";

export type DashboardRole = "admin" | "user";

export type ChartData = {
  name: string;
  value: number;
};

export type DashboardChartsProps =
  | {
      data?: AdminDashboardResponse | null;
      role: "admin";
    }
  | {
      data?: UserDashboardResponse | null;
      role: "user";
    };

const CHART_COLORS = ["#2563eb", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];

const toSafeNumber = (value: unknown): number => {
  const numberValue = typeof value === "number" ? value : Number(value);

  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : 0;
};

const toCount = (value: unknown): number => {
  return Array.isArray(value) ? value.length : toSafeNumber(value);
};

/**
 * Converts either dashboard API response into the shared format required by Recharts.
 * A zero-filled data set is returned while data is unavailable or incomplete.
 */
export function transformDashboardData(
  data: AdminDashboardResponse | UserDashboardResponse | null | undefined,
  role: DashboardRole,
): ChartData[] {
  if (role === "admin") {
    const dashboard =
      data && "adminDashboardPost" in data ? data.adminDashboardPost : undefined;

    return [
      { name: "Approved Posts", value: toSafeNumber(dashboard?.ApprovedPost) },
      { name: "Drafted Posts", value: toSafeNumber(dashboard?.countDraftedPost) },
      { name: "Free Posts", value: toSafeNumber(dashboard?.freePost) },
      { name: "Paid Posts", value: toSafeNumber(dashboard?.paidPost) },
      { name: "Total Posts", value: toSafeNumber(dashboard?.totalPost) },
    ];
  }

  const userResponse =
    data && !("adminDashboardPost" in data) ? data : undefined;
  const dashboard =
    userResponse?.UserDashBoardPost ?? userResponse?.userDashboardPost;

  return [
    {
      name: "Approved Posts",
      value: toCount(dashboard?.countApprovedPost ?? dashboard?.approvedPost ?? dashboard?.ApprovedPost),
    },
    {
      name: "Drafted Posts",
      value: toCount(dashboard?.countDraftedPost ?? dashboard?.draftedPost ?? dashboard?.DraftedPost),
    },
    {
      name: "Free Posts",
      value: toCount(dashboard?.countfreePost ?? dashboard?.freePost),
    },
    {
      name: "Paid Posts",
      value: toCount(dashboard?.countPaidPost ?? dashboard?.paidPost),
    },
    { name: "Total Posts", value: toSafeNumber(dashboard?.totalPost) },
  ];
}

export function DashboardStatsCards({
  data,
  role,
}: DashboardChartsProps) {
  const stats = useMemo(() => transformDashboardData(data, role), [data, role]);

  return (
    <section
      aria-label="Post statistics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
    >
      {stats.map((stat, index) => (
        <Card
          key={stat.name}
          className="border-border/60 shadow-sm transition-shadow hover:shadow-md"
        >
          <CardContent className="flex min-h-28 flex-col justify-center py-5">
            <p className="text-sm font-medium text-muted-foreground">
              {stat.name}
            </p>
            <p
              className="mt-2 text-3xl font-semibold tracking-tight"
              style={{ color: CHART_COLORS[index % CHART_COLORS.length] }}
            >
              {stat.value.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export default function DashboardCharts({
  data,
  role,
}: DashboardChartsProps) {
  const overviewData = useMemo(
    () => transformDashboardData(data, role),
    [data, role],
  );

  const distributionData = useMemo(
    () => overviewData.filter(({ name }) => name !== "Total Posts"),
    [overviewData],
  );

  return (
    <section
      aria-label="Post analytics"
      className="grid grid-cols-1 gap-6 lg:grid-cols-2"
    >
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Post Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[380px] pt-0 sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="42%"
                innerRadius={48}
                outerRadius={90}
                paddingAngle={3}
                labelLine={false}
                label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
              >
                {distributionData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, "Posts"]} />
              <Legend
                verticalAlign="bottom"
                height={64}
                iconSize={9}
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Posts Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[380px] pt-0 sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={overviewData}
              margin={{ top: 12, right: 8, left: -16, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                interval={0}
                tickFormatter={(value: string) => value.replace(" Posts", "")}
                angle={-28}
                textAnchor="end"
                height={64}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                formatter={(value) => [value, "Posts"]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {overviewData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
}
