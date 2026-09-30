'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthStore, UserRole } from "@/src/store/useAuthStore";

type MenuItem = {
  label: string;
  href: string;
};

const dashboardHome: Record<UserRole, string> = {
  CUSTOMER: "/dashboard/customer",
  TECHNICIAN: "/dashboard/technician",
  ADMIN: "/dashboard/admin",
};

const menus: Record<UserRole, MenuItem[]> = {
  CUSTOMER: [
    { label: "Overview", href: "/dashboard/customer" },
    { label: "My Reports", href: "/dashboard/customer/reports" },
    { label: "Bills & Payments", href: "/dashboard/customer/bills" },
  ],
  TECHNICIAN: [
    { label: "Overview", href: "/dashboard/technician" },
    { label: "My Assignments", href: "/dashboard/technician/assignments" },
  ],
  ADMIN: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Users", href: "/dashboard/admin/users" },
    { label: "Schedules", href: "/dashboard/admin/schedules" },
    { label: "Outages", href: "/dashboard/admin/outages" },
    { label: "Assignments", href: "/dashboard/admin/assignments" },
  ],
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn || !user) {
      router.replace('/auth/login');
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  const home = dashboardHome[user.role];
  const allowed = pathname === home || pathname.startsWith(`${home}/`);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <aside className="w-full border-b border-slate-200 bg-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
        <div className="border-b border-slate-200 p-6">
          <Link href="/" className="text-2xl font-bold text-amber-600">
            LoadShedding
          </Link>
          <p className="mt-2 text-xs font-semibold tracking-wider text-slate-500">
            {user.role} DASHBOARD
          </p>
        </div>

        <nav aria-label="Dashboard navigation" className="flex flex-wrap gap-2 p-4 md:flex-col">
          {menus[user.role]?.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  active ? "bg-amber-500 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="text-right">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-slate-500">{user.role}</p>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}