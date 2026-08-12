"use client";

import Image from "next/image";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  CheckCircle,
  UserPlus,
  MessageSquare,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardNavbar = () => {
  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background px-4 md:px-6">
      <div className="flex h-full items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            priority
          />

          <h1 className="hidden text-lg font-semibold md:block">
            Dashboard
          </h1>
        </div>

        {/* Search */}
        <form className="hidden max-w-xl flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="search"
              placeholder="Search..."
              className="h-10 pl-10 pr-24"
            />

            <button
              type="submit"
              className="
                absolute right-1 top-1/2
                -translate-y-1/2
                rounded-md
                px-3 py-1.5
                text-sm
                bg-primary
                text-primary-foreground
              "
            >
              Search
            </button>
          </div>
        </form>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent">
              <Bell className="h-5 w-5" />

              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                3
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
              <div className="px-3 py-2">
                <p className="font-semibold">Notifications</p>
                <p className="text-xs text-muted-foreground">
                  You have 3 unread notifications
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <UserPlus className="mr-2 h-4 w-4" />
                New user registered
              </DropdownMenuItem>

              <DropdownMenuItem>
                <CheckCircle className="mr-2 h-4 w-4" />
                Payment completed
              </DropdownMenuItem>

              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                New message received
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="justify-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full outline-none">
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="font-medium">Abu Syeed Asad</p>
                <p className="text-sm text-muted-foreground">
                  admin@example.com
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;