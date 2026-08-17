"use client";

import HomePage from "@/app/(commonLayout)/page";
import { userRole } from "@/lib/auth/authUtils";

import AdminDasboardContent from "./AdminDasboardContent";
import UserDashBoardContent from "./UserDashBoardContent";

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
