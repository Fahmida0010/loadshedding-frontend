'use client';

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import Logo from "./Logo";
import { useAuthStore } from "@/src/store/useAuthStore";
import { LogOut } from "lucide-react";

interface NavbarProps {
    onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
    const { isLoggedIn, user, logout } = useAuthStore();
    
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
    const [isContactAboutDropdownOpen, setIsContactAboutDropdownOpen] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const contactDropdownRef = useRef<HTMLDivElement>(null);

    // Role onusare dashboard route nirdharon kora
    const getDashboardRoute = () => {
        if (!user) return "/dashboard";
        switch (user.role) {
            case "ADMIN":
                return "/dashboard/admin";
            case "TECHNICIAN":
                return "/dashboard/technician";
            case "CUSTOMER":
                return "/dashboard/customer";
            default:
                return "/dashboard/customer";
        }
    };

    // Click outside to close dropdowns
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
            if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target as Node)) {
                setIsContactAboutDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            
            {/* Left Side: Mobile Sidebar Toggle & Logo */}
            <div className="flex items-center gap-3">
                {onToggleSidebar && (
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-lg hover:bg-slate-100 lg:hidden text-slate-600 focus:outline-none"
                        aria-label="Toggle Sidebar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}
                <Logo size="sm" />
            </div>

            {/* Middle Side: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
                <Link href="/outages" className="hover:text-amber-500 transition-colors">Outages</Link>
                <Link href="/schedules" className="hover:text-amber-500 transition-colors">Schedules</Link>
                
                {/* User login kora thaklei shudhu role-based dashboard link dekhabe */}
                {isLoggedIn && (
                    <Link href={getDashboardRoute()} className="hover:text-amber-500 transition-colors">
                        Dashboard
                    </Link>
                )}

                {/* Contact & About Dropdown */}
                <div className="relative" ref={contactDropdownRef}>
                    <button
                        onClick={() => setIsContactAboutDropdownOpen(!isContactAboutDropdownOpen)}
                        className="flex items-center gap-1 hover:text-amber-500 transition-colors focus:outline-none py-2"
                    >
                        <span>More</span>
                        <svg className={`w-4 h-4 transition-transform duration-200 ${isContactAboutDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isContactAboutDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                            <Link
                                href="/about"
                                onClick={() => setIsContactAboutDropdownOpen(false)}
                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/contact"
                                onClick={() => setIsContactAboutDropdownOpen(false)}
                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Contact
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Right Side: Notifications & Dynamic Profile / Login */}
            <div className="flex items-center gap-3">
                
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

                {/* User Profile Section with Dropdown OR Login Button */}
                {isLoggedIn ? (
                    <div className="relative" ref={profileDropdownRef}>
                        <button
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 focus:outline-none"
                        >
                            <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex 
                            items-center justify-center font-semibold text-sm shadow-inner overflow-hidden
                             border border-amber-600">
                                {user?.avatar || user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-slate-800 leading-tight">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-xs text-slate-500">{user?.role || "Active Profile"}</p>
                            </div>
                        </button>

                        {/* Profile Dropdown Menu */}
                        {isProfileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                {/* Profile Info Section inside Dropdown */}
                                <div className="px-4 py-2 border-b border-slate-100">
                                    <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full">
                                        {user?.role}
                                    </span>
                                </div>

                                <Link
                                    href={getDashboardRoute()}
                                    onClick={() => setIsProfileDropdownOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                     Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsProfileDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors"
                                >
                                     <LogOut className="h-4 w-4" />
                                     Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        href="/auth/login"
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                    >
                        Login
                    </Link>
                )}

                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg hover:bg-slate-100 md:hidden text-slate-600 focus:outline-none"
                    aria-label="Toggle Mobile Menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl py-4 px-6 flex flex-col gap-3 md:hidden z-45 animate-in slide-in-from-top-2">
                    <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-slate-700 font-medium py-2 border-b border-slate-100"
                    >
                        Home
                    </Link>
                    <Link
                        href="/outages"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-slate-700 font-medium py-2 border-b border-slate-100"
                    >
                        Outages
                    </Link>
                    <Link
                        href="/schedules"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-slate-700 font-medium py-2 border-b border-slate-100"
                    >
                        Schedules
                    </Link>
                    {isLoggedIn && (
                        <Link
                            href={getDashboardRoute()}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-slate-700 font-medium py-2 border-b border-slate-100"
                        >
                            Dashboard
                        </Link>
                    )}
                    <Link
                        href="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-slate-700 font-medium py-2 border-b border-slate-100"
                    >
                        About Us
                    </Link>
                    <Link
                        href="/contact"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-slate-700 font-medium py-2"
                    >
                        Contact
                    </Link>
                </div>
            )}
        </header>
    );
}