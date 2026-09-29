'use client';

import Link from "next/link";
import React, { useState } from "react";
import Logo from "./Logo";

interface NavbarProps {
    onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
    // ডেমো হিসেবে এখানে isLoggedIn স্টেট রাখা হয়েছে (প্রয়োজন অনুযায়ী অ্যাথেন্টিকেশন লজিক বসিয়ে নিও)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); 
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    return (
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            
            {/* Left Side: Mobile Menu Toggle & Logo */}
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

                {/* Logo.tsx কম্পোনেন্ট ব্যবহার করা হলো */}
                <Logo size="sm" />
            </div>

            {/* Middle Side: Navigation Links (Home, About, Contact, Schedules, Outages) */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
                <Link href="/about" className="hover:text-amber-500 transition-colors">About</Link>
                <Link href="/contact" className="hover:text-amber-500 transition-colors">Contact</Link>
                <Link href="/schedules" className="hover:text-amber-500 transition-colors">Schedules</Link>
                <Link href="/outages" className="hover:text-amber-500 transition-colors">Outages</Link>
            </nav>

            {/* Right Side: Emergency Alert, Notifications & Profile / Login */}
            <div className="flex items-center gap-4">
                
            

                {/* Notification Bell with Badge */}
                <button
                    className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                    aria-label="View Notifications"
                >
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                </button>

                {/* User Profile Section with Dropdown OR Login Button */}
                {isLoggedIn ? (
                    <div className="relative">
                        {/* Profile Image / Avatar Clickable */}
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 pl-3 border-l border-slate-200 focus:outline-none"
                        >
                            <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-semibold text-sm shadow-inner overflow-hidden border border-amber-600">
                                {/* চাইলে এখানে <Image> ট্যাগ দিয়ে ইউজার প্রোফাইল পিকচার দিতে পারো */}
                                AD
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-slate-800 leading-tight">
                                    System Admin
                                </p>
                                <p className="text-xs text-slate-500">Active Profile</p>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                >
                                    📊 Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsLoggedIn(false);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Login Button if user is not logged in */
                    <Link
                        href="/auth/login"
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                    >
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
}