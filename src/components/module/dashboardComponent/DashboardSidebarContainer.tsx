import React from 'react';
import DashboardItems from './DashboardItems';
import { Separator } from '@/components/ui/separator';
import { IUser } from '@/types/auth.type';
import { getNavItemsByRole } from '@/lib/dashboard/navItems';
import { userRole } from '@/lib/auth/authUtils';

const DashboardSidebarContainer: React.FC<{ userInfo: IUser }> = ({
  userInfo,
}) => {
  const userNavItems = getNavItemsByRole(userInfo.role as userRole);

  return (
    <div className="flex flex-col border h-full">
      {/* Navigation Area */}
      <div className="flex-1 overflow-y-auto p-2">
        <DashboardItems items={userNavItems} />
      </div>

      <Separator />
     <div className="p-4">
        <h1 className="font-medium">{userInfo.name}</h1>
        <p className="text-sm text-muted-foreground">
          {userInfo.role}
        </p>

        <button className="mt-2">
          Log Out
        </button>
      </div>

    </div>
  );
};

export default DashboardSidebarContainer;