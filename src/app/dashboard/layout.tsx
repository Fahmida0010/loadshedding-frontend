"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

type User = {
  name: string;
  role: Role;
};

type MenuItem = {
  label: string;
  href: string;
};

const dashboardHome: Record<Role, string> = {
  CUSTOMER: "/dashboard/customer",
  TECHNICIAN: "/dashboard/technician",
  ADMIN: "/dashboard/admin",
};

const menus: Record<Role, MenuItem[]> = {
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

function isRole(value: unknown): value is Role {
  return (
    value === "CUSTOMER" ||
    value === "TECHNICIAN" ||
    value === "ADMIN"
  );
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured.");
        }

        const response = await fetch(`${apiUrl}/auth/me`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load your account.");
        }

        const body = await response.json();
        const profile = body.data;

        if (!profile || !isRole(profile.role)) {
          throw new Error("Invalid account role.");
        }

        setUser({
          name: typeof profile.name === "string" ? profile.name : "User",
          role: profile.role,
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        );
      }
    }

    void loadUser();

    return () => controller.abort();
  }, [router]);

  const home = user ? dashboardHome[user.role] : null;

  const allowed =
    home !== null &&
    (pathname === home || pathname.startsWith(`${home}/`));

  useEffect(() => {
    if (home && !allowed) {
      router.replace(home);
    }
  }, [home, allowed, router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5">
        <p role="alert" className="text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!user || !allowed) {
    return (
      <div
        role="status"
        className="flex min-h-screen items-center justify-center text-slate-500"
      >
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <aside className="w-full border-b border-slate-200 bg-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
        <div className="border-b border-slate-200 p-6">
          <Link href="/" className="text-2xl font-bold text-emerald-700">
            PowerTrack
          </Link>

          <p className="mt-2 text-xs font-semibold tracking-wider text-slate-500">
            {user.role} DASHBOARD
          </p>
        </div>

        <nav
          aria-label="Dashboard navigation"
          className="flex flex-wrap gap-2 p-4 md:flex-col"
        >
          {menus[user.role].map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== home &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-700 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/"
            className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 md:mt-6"
          >
            ← Back to website
          </Link>
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