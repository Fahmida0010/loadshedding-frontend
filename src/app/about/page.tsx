import React from "react";
import Image from "next/image";
import { ShieldCheck, Zap, Bell, Clock, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            About <span className="text-amber-500">LoadShedding Tracker</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Empowering communities with real-time power outage tracking, automated schedule management, and instant alerts for secure electricity distribution.
          </p>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission & Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              In modern power distribution systems, unpredictable outages can cause significant disruptions. Our mission is to bridge the communication gap between power utility providers and consumers by delivering accurate, real-time data and automated notifications.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We envision a fully transparent energy ecosystem where households and businesses can efficiently manage their power consumption, minimize downtime, and stay prepared.
            </p>
          </div>
          <div className="bg-amber-100 p-8 rounded-2xl shadow-inner border border-amber-200 flex flex-col justify-center space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-500 text-white rounded-xl">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Real-Time Tracking</h3>
                <p className="text-sm text-gray-600">Instant updates on current and upcoming grid outages.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-500 text-white rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Reliable & Secure</h3>
                <p className="text-sm text-gray-600">Built with robust architecture to ensure data integrity.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Features Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">What We Offer</h2>
            <p className="text-gray-600 mt-2">Key features designed to keep you ahead of power cuts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div className="p-3 bg-amber-50 text-amber-600 w-fit rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Area-wise Schedules</h3>
              <p className="text-gray-600 text-sm">
                Check detailed load shedding schedules customized for your specific zone and locality ahead of time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div className="p-3 bg-amber-50 text-amber-600 w-fit rounded-lg">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Instant Alerts</h3>
              <p className="text-gray-600 text-sm">
                Receive push notifications and emergency alerts before maintenance or emergency power shedding begins.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div className="p-3 bg-amber-50 text-amber-600 w-fit rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Role-Based Access</h3>
              <p className="text-gray-600 text-sm">
                Dedicated interfaces for Admins, Power Providers, and Regular Users to streamline management efficiently.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}