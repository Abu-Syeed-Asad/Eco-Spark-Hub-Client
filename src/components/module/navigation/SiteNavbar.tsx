"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  Info,
  LayoutDashboard,
  Leaf,
  LogIn,
  Mail,
  Menu,
  Moon,
  Sun,
  UserRound,
  X,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/auth.type";

type SiteNavbarProps = {
  user?: IUser | null;
};

type NavigationItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Mail },
];

const getIsActive = (pathname: string, href: string) =>
  href === "/dashboard" ? pathname.startsWith("/dashboard") : pathname === href;

const themeChangeEvent = "eco-spark-theme-change";

const getThemeSnapshot = () => {
  const savedTheme = window.localStorage.getItem("eco-spark-theme");
  return (
    savedTheme === "dark" ||
    (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
};

const subscribeToTheme = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener(themeChangeEvent, onStoreChange);
  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    window.removeEventListener(themeChangeEvent, onStoreChange);
    mediaQuery.removeEventListener("change", onStoreChange);
  };
};

export default function SiteNavbar({ user = null }: SiteNavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => false,
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeMenuOnEscape);
    return () => window.removeEventListener("keydown", closeMenuOnEscape);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    window.localStorage.setItem("eco-spark-theme", nextIsDark ? "dark" : "light");
    window.dispatchEvent(new Event(themeChangeEvent));
  };

  const accountLink = user
    ? { href: "/my-profile", icon: UserRound }
    : { href: "/auth/login", label: "Login", icon: LogIn };
  const AccountIcon = accountLink.icon;
  const profileInitials = user?.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-white/90 text-slate-900 shadow-sm backdrop-blur dark:border-emerald-50/10 dark:bg-slate-950/90 dark:text-slate-50">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-md font-bold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
          onClick={closeMenu}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Leaf className="size-5" aria-hidden="true" />
          </span>
          <span className="truncate text-base sm:text-lg">Eco Spark Hub</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navigationItems.map(({ label, href }) => {
            const isActive = getIsActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                  isActive
                    ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-300"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-300",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid size-10 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
          </button>

          <Link
            href={accountLink.href}
            className={cn(
              "hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 sm:flex",
              user
                ? "text-slate-700 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-slate-800"
                : "bg-emerald-600 text-white hover:bg-emerald-700",
            )}
          >
            {user ? (
              <Avatar className="size-10 border border-emerald-600/20">
                {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                <AvatarFallback className="bg-emerald-800 text-xs font-bold text-white">
                  {profileInitials || "U"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <AccountIcon className="size-4" aria-hidden="true" />
            )}
            {accountLink.label}
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="grid size-10 place-items-center rounded-lg text-slate-700 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav
            id="mobile-navigation"
            className="absolute inset-x-0 top-full border-b border-emerald-950/10 bg-white p-3 shadow-lg dark:border-emerald-50/10 dark:bg-slate-950 md:hidden"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto grid max-w-7xl gap-1">
              {navigationItems.map(({ label, href, icon: Icon }) => {
                const isActive = getIsActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                      isActive
                        ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : "text-slate-700 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-slate-800",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </Link>
                );
              })}
              <Link
                href={accountLink.href}
                onClick={closeMenu}
                className={cn(
                  "mt-1 flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                  user
                    ? "text-slate-700 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    : "bg-emerald-600 text-white hover:bg-emerald-700",
                )}
              >
                {user ? (
                  <Avatar className="size-10 border border-emerald-600/20">
                    {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                    <AvatarFallback className="bg-emerald-800 text-xs font-bold text-white">
                      {profileInitials || "U"}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <AccountIcon className="size-4" aria-hidden="true" />
                )}
                {accountLink.label}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
