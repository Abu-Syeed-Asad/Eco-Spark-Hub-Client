import React from 'react';
import DashboardItems from './DashboardItems';
import UserProfile from './UserProfile';
import { IUser } from '@/types/auth.type';
import { getNavItemsByRole } from '@/lib/dashboard/navItems';
import { userRole } from '@/lib/auth/authUtils';

const DashboardSidebarContainer: React.FC<{ userInfo: IUser | null }> = ({
  userInfo,
}) => {
  if (!userInfo) {
    return null;
  }

  const userNavItems = getNavItemsByRole(userInfo.role as userRole);

  return (
    <div className="flex h-full flex-col overflow-hidden border">
      {/* Navigation Area */}
      <div className="flex-1 overflow-y-auto p-2">
        <DashboardItems items={userNavItems} />
      </div>

      {/* User Profile Section - Sticky at bottom */}
      <UserProfile userInfo={userInfo} />
    </div>
  );
};

export default DashboardSidebarContainer;