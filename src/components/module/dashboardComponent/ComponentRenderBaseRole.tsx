import HomePage from '@/app/(commonLayout)/page';
import React from 'react';
import AdminDasboardContent from './AdminDasboardContent';
import UserDashBoardContent from './UserDashBoardContent';
import { userRole } from '@/lib/auth/authUtils';

const ComponentRenderBaseRole = ({ role }: { role: userRole }) => {
  switch (role) {
    case "ADMIN":
      return <AdminDasboardContent />;
    case "USER":
      return <UserDashBoardContent />;
    default:
      return <HomePage />;
  }
};

export default ComponentRenderBaseRole;