"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthStore, UserRole } from "@/src/store/useAuthStore";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  ClipboardList,
  Users,
  Calendar,
  Building2,
  MapPin,
  Zap,
  AlertTriangle,
  UserCheck,
  User,
  Settings,
  LogOut,
  Home,
  Layers,
} from "lucide-react";
import Loading from "../loading";

type MenuItem = {
  label: string;
  href: string;
  icon: any;
};

const dashboardHome: Record<UserRole, string> = {
  CUSTOMER: "/dashboard/customer",
  TECHNICIAN: "/dashboard/technician",
  ADMIN: "/dashboard/admin",
};

// Role wise sidebar navigation menus
const menus: Record<UserRole, MenuItem[]> = {
  CUSTOMER: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    {
      label: "My Reports",
      href: "/dashboard/customer/my-reports",
      icon: FileText,
    },
    {
      label: "Bills & Payments",
      href: "/dashboard/customer/payments",
      icon: CreditCard,
    },
  ],
  TECHNICIAN: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
    {
      label: "My Assignments",
      href: "/dashboard/technician/my-assignments",
      icon: ClipboardList,
    },
  ],
  ADMIN: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "Distribution Zones",
      href: "/dashboard/admin/distribution-zones",
      icon: MapPin,
    },
    {
      label: "Substations",
      href: "/dashboard/admin/substations",
      icon: Building2,
    },
    { label: "Feeders", href: "/dashboard/admin/feeders", icon: Zap },
    { label: "Areas", href: "/dashboard/admin/areas", icon: MapPin },
    { label: "Schedules", href: "/dashboard/admin/schedules", icon: Calendar },
    { label: "Outages", href: "/dashboard/admin/outages", icon: AlertTriangle },
    {
      label: "Assignments",
      href: "/dashboard/admin/assignments",
      icon: UserCheck,
    },
    { label: "Payment History", href: "/dashboard/admin/payments", icon: CreditCard },
  ],
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, logout, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && (!isLoggedIn || !user)) {
      router.replace("/auth/login");
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || !user) {
    return <Loading />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (logout) logout();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      {/* Sidebar Container */}
      <aside
        className="w-full border-b border-slate-200 bg-white md:sticky md:top-0 md:h-screen md:w-64
       md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0 flex flex-col "
      >
        <div>
          {/* Logo & Role Section */}
          <div className="border-b border-slate-100 p-6">
            <Link
              href="/"
              className="text-2xl font-black text-amber-600 tracking-tight flex items-center gap-2"
            >
              <Zap className="h-6 w-6 text-amber-500 fill-amber-500" />
              LoadShedding
            </Link>
            <span className="mt-2 inline-block rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold tracking-wider text-amber-700">
              {user.role} DASHBOARD
            </span>
          </div>

          {/* Main Dashboard Navigation */}
          <div className="p-4">
            <nav aria-label="Dashboard navigation" className="space-y-1">
              {menus[user.role]?.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                      active
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${active ? "text-white" : "text-slate-500"}`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-1 mt-4">
              {/* Profile Link Updated */}
              <Link
                href="/dashboard/profile"
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                  pathname === "/dashboard/profile"
                    ? "bg-amber-500 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <User
                  className={`h-4 w-4 ${pathname === "/dashboard/profile" ? "text-white" : "text-slate-500"}`}
                />
                Profile
              </Link>

              <Link
                href="/dashboard/settings"
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                  pathname === "/dashboard/settings"
                    ? "bg-amber-500 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Settings
                  className={`h-4 w-4 ${pathname === "/dashboard/settings" ? "text-white" : "text-slate-500"}`}
                />
                Settings
              </Link>

              <Link
                href="/"
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
              >
                <Home className="h-4 w-4 text-slate-500" />
                Go Back Home
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Logout Button */}
        <div className="p-4 border-t border-slate-100 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center 
            justify-center gap-2 rounded-xl bg-red-50 px-4 
            py-2.5 text-sm font-bold text-red-600
             hover:bg-red-100 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 flex flex-col">
        {/* Dynamic Children Content */}
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
