

import { getDefaultDashboardRoute, userRole } from "../auth/authUtils";

export interface NavItems {
  title: string;
  href: string;
  icon: string;
}
 export interface NavSection {
  title?: string;
  items:NavItems[]  
}
export const getCommonNaveItems = (role: userRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);
  return [
    // {
    //   items: [
    //     {
    //       title: "Home",
    //       href: "/",
    //       icon: "Home"
    //     },
    //     {
    //       title: "Dashboard",
    //       href: defaultDashboard,
    //       icon: "LayoutDashboard",
    //     },
    //     {
    //       title: "My Profile",
    //       href: "/auth/me",
    //       icon: "User"
    //     }
    //   ]
    // },
    // {
    //   title: "Setting",
    //   items: [
    //     {
    //       title: "Change Password",
    //       href: "/auth/change-password",
    //       icon: "Settings"
    //     }
    //   ]
    // }
  ]
};

export const UserNavItems: NavSection[] = [{
  title: "Post Management",
  items: [
    {
      title: "All-Post",
      href: "/dashboard/user/my-post",
      icon:"SeeIcon"
    },
    {
      title:"Create Post",
      href:"/dashboard/user/create-post",
      icon:"PlusSquareIcon"
    },
    {
      title: "Payment",
      href: "/dashboard/user/payment",
      icon: "CreditCardIcon"
    },

  ]
}];

export const AdminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "All-User",
        href: "/dashboard/admin/all-user",
        icon: "UsersIcon"
      },
      {
        title: "All-Post",
        href: "/dashboard/admin/all-post",
        icon: "SeeIcon"
      },
      {
        title: "All-Payment",
        href: "/dashboard/admin/all-payment",
        icon: "CreditCardIcon"
      },
    ]
  }
];

export const getNavItemsByRole = (role: userRole): NavSection[] => {
  const commonNavItems = getCommonNaveItems(role);
  switch (role) {
    case "USER":
      return [...commonNavItems, ...UserNavItems];
    case "ADMIN": return [...commonNavItems, ...AdminNavItems]
  }
};
