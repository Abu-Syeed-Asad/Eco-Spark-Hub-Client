"use client"

import { logoutAction } from '@/app/auth/logout/action';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
  return (
    <form action={logoutAction} className="w-full">
      <button
        type="submit"
        className="w-full px-2 py-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-sm flex items-center cursor-pointer"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </button>
    </form>
  );
};

export default LogoutButton;