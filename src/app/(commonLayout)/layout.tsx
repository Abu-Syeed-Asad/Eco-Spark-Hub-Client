import React from "react";

import SiteNavbar from "@/components/module/navigation/SiteNavbar";
import { getUserInfo } from "@/service/auth/auth.service";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserInfo();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#d1fae5,_transparent_36%),linear-gradient(135deg,_#f8fafc_0%,_#ecfdf5_100%)] dark:bg-[radial-gradient(circle_at_top_right,_#064e3b,_transparent_36%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)]">
      <SiteNavbar user={user} />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        {children}
      </main>
    </div>
  );
};

export default HomeLayout;
