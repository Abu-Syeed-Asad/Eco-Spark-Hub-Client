import { redirect } from "next/navigation";

import DashboardNavber from "@/components/module/dashboardComponent/DashboardNavber";
import DashboardSidebarContainer from "@/components/module/dashboardComponent/DashboardSidebarContainer";
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

  return (

    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardNavber userInfo={userInfo} />

      {/* Content Area */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r bg-background md:flex">
          <div className="h-full w-full overflow-hidden">
            <DashboardSidebarContainer userInfo={userInfo} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-h-0 flex-1 overflow-y-auto bg-muted/20 p-6">
          {children}
        </main>
      </div>
    </div>

  );
};

export default DashBoardLayout;
