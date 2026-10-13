import type { ReactNode } from "react";
import type { IUser } from "@/types/auth.type";
import DashboardNavber from "./DashboardNavber";
import DashboardSidebarContainer from "./DashboardSidebarContainer";

export default function DashboardShell({ userInfo, children }: { userInfo: IUser; children: ReactNode }) {
  return (

    <div data-dashboard-shell className="relative flex h-dvh min-h-0 w-full min-w-0 flex-col overflow-hidden bg-background">
      <DashboardNavber userInfo={userInfo} />

      {/* Content Area */}
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden h-full min-h-0 w-64 shrink-0 overflow-hidden border-r bg-background md:flex">
          <DashboardSidebarContainer userInfo={userInfo} />
        </aside>

        {/* Main Content */}
        <main className="min-h-0 w-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-muted/20 p-3 sm:p-4 lg:p-6">
          <div className="w-full min-w-0">{children}</div>
        </main>
      </div>
    </div>

  );
}
