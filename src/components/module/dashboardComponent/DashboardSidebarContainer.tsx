import React from 'react';
import DashboardItems from './DashboardItems';
import UserProfile from './UserProfile';
import { IUser } from '@/types/auth.type';
import { getNavItemsByRole } from '@/lib/dashboard/navItems';
import { userRole } from '@/lib/auth/authUtils';

const DashboardSidebarContainer: React.FC<{
  userInfo: IUser | null;
  onNavigate?: () => void;
}> = ({ userInfo, onNavigate }) => {
  if (!userInfo) {
    return null;
  }

  const userNavItems = getNavItemsByRole(userInfo.role as userRole);

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden">
      {/* Navigation Area */}
      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-3">
        <DashboardItems items={userNavItems} onNavigate={onNavigate} />
      </div>

      {/* User Profile Section - Sticky at bottom */}
      <UserProfile userInfo={userInfo} />
    </div>
  );
};

export default DashboardSidebarContainer;
