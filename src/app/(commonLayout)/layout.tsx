import React from "react";
import Link from "next/link";
import { ArrowUpRight, Leaf, Mail, MapPin } from "lucide-react";

import SiteNavbar from "@/components/module/navigation/SiteNavbar";
import { getUserInfo } from "@/service/auth/auth.service";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserInfo();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#d1fae5,_transparent_36%),linear-gradient(135deg,_#f8fafc_0%,_#ecfdf5_100%)] dark:bg-[radial-gradient(circle_at_top_right,_#064e3b,_transparent_36%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)]">
      <SiteNavbar user={user} />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        {children}
      </main>

      <footer className="border-t border-emerald-950/10 bg-white/80 backdrop-blur-sm dark:border-emerald-50/10 dark:bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-500/20">
                  <Leaf className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    Eco Spark Hub
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                    Community Impact
                  </p>
                </div>
              </div>

              <p className="max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                Empowering eco-conscious communities through sustainable ideas, insightful
                updates, and actionable action.
              </p>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-500/10 dark:text-emerald-300">
                <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
                Building a greener tomorrow
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Quick links
              </h3>
              <ul className="space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300"
                    >
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Reach us
              </h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <a href="mailto:mda457956@gmail.com" className="hover:text-emerald-700 dark:hover:text-emerald-300">
                   mda457956@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>Dhaka, Bangladesh</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Abu Syeed Asad. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-300">
                Privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-300">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
