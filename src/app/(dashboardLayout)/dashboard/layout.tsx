import { redirect } from "next/navigation";

import DashboardShell from "@/components/module/dashboardComponent/DashboardShell";
import { getUserInfo } from "@/service/auth/auth.service";
import { IUser } from "@/types/auth.type";

export const dynamic = 'force-dynamic';

const DashBoardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const userInfo: IUser | null = await getUserInfo();

  if (!userInfo) {
    redirect("/auth/login");
  }

  return <DashboardShell userInfo={userInfo}>{children}</DashboardShell>;
};

export default DashBoardLayout;
