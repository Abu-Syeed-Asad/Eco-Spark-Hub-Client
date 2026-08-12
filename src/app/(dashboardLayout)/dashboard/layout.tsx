
import DashboardNavber from '@/components/module/dashboardComponent/DashboardNavber';
import DashboardSidebarContainer from '@/components/module/dashboardComponent/DashboardSidebarContainer';
import { getUserInfo } from '@/service/auth/auth.service';
import { IUser } from '@/types/auth.type';
import React from 'react';

const DashBoardLayout =async  ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const displaysize = 800;
  const userInfo :IUser = await getUserInfo();
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <DashboardNavber />
      </header>

      <div className="flex flex-1">
        <aside className="w-64 hidden md:block h-full">
          {displaysize > 700 && (
            <DashboardSidebarContainer userInfo={userInfo} />
          )}
        </aside>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashBoardLayout;
