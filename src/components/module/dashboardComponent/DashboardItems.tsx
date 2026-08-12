"use client";

import Link from "next/link";

import { getIconComponent } from "@/lib/iconMapper";




type NavItem = {
  title: string;
  href: string;
  icon: string;
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

interface DashboardItemsProps {
  items: NavSection[];
}

const DashboardItems = ({ items }: DashboardItemsProps) => {
 return (
   <div>
     {/* here are set static hight set for the user info statically set  */}
      <div className="min-h-134 overflow-y-auto">
        {items.map((section, index) => (
          <div key={index}>
            {section.title && (
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                {section.title}
              </h3>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = getIconComponent(item.icon);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardItems;