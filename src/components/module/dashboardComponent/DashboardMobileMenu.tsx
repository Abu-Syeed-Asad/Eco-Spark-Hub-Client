"use client";

import { useState } from "react";
import { PanelLeft } from "lucide-react";

import DashboardSidebarContainer from "@/components/module/dashboardComponent/DashboardSidebarContainer";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { IUser } from "@/types/auth.type";

const DashboardMobileMenu = ({ userInfo }: { userInfo: IUser }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        className="grid size-10 place-items-center rounded-lg text-slate-700 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
        aria-label="Open dashboard menu"
      >
        <PanelLeft className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 max-w-[85vw] gap-0 border-r border-slate-200 bg-background p-0"
      >
        <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
        <DashboardSidebarContainer
          userInfo={userInfo}
          onNavigate={() => setIsOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
};

export default DashboardMobileMenu;
