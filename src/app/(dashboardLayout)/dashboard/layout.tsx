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
  const userInfo: IUser = await getUserInfo();

  return (
    <div className="h-screen overflow-hidden">
      {/* Navbar */}
      <header className="h-16 border-b shrink-0">
        <DashboardNavber userInfo={userInfo} />
      </header>

      {/* Content Area */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 border-r shrink-0 ">
          <DashboardSidebarContainer userInfo={userInfo} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashBoardLayout;