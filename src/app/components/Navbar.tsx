import React from "react";
import Link from "next/link";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      
      {/* Left Side: Brand Name & Mobile Menu Toggle */}
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button 
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 lg:hidden text-slate-600"
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
        )}
        
        <Link href="/" className="font-bold text-lg text-slate-800 flex items-center gap-2">
          {/* Status Indicator Dot */}
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block animate-pulse" />
          <span>GridGuard <span className="text-xs font-normal text-slate-500 hidden sm:inline">| Outage Management</span></span>
        </Link>
      </div>

      {/* Right Side: Emergency Alert, Notifications & Profile */}
      <div className="flex items-center gap-4">
        
        {/* Emergency Hotline Badge (Desktop view) */}
        <div className="hidden md:flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-200">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          Emergency Helpline: 16123
        </div>

        {/* Notification Bell with Badge */}
        <button 
          className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          aria-label="View Notifications"
        >
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* User Profile Section */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-sm shadow-inner">
            AD
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-800 leading-tight">System Admin</p>
            <p className="text-xs text-slate-500">Control Panel</p>
          </div>
        </div>

      </div>
    </header>
  );
}