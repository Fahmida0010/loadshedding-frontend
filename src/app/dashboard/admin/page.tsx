"use client";

import React, { useEffect, useState } from "react";
import {
	FaCalendarAlt,
	FaChartBar,
	FaChartLine,
	FaCheckCircle,
	FaExclamationTriangle,
	FaTasks,
	FaTools,
	FaUserCheck,
	FaUserShield,
	FaUserSlash,
	FaUsers,
} from "react-icons/fa";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import Swal from "sweetalert2";
import { useAxiosSecure } from "@/src/hooks/useAxiosSecure";
import Loading from "../../loading";

interface DashboardData {
	users: {
		total: number;
		active: number;
		blocked: number;
		byRole: {
			admins: number;
			technicians: number;
			customers: number;
		};
	};
	schedules: {
		total: number;
		active: number;
	};
	outages: {
		total: number;
		active: number;
		resolved: number;
	};
	assignments: {
		total: number;
		active: number;
		completed: number;
	};
	recent: {
		users: any[];
		outages: any[];
	};
}

export default function AdminDashboardPage() {
	const axiosSecure = useAxiosSecure();
	const [stats, setStats] = useState<DashboardData | null>(null);
	const [chartData, setChartData] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const fetchDashboardStats = async () => {
		try {
			setLoading(true);
			const response = await axiosSecure.get("/admin/dashboard-stats");
			const responseData = response.data?.data || response.data;

			setStats(responseData);

			// Monthly Chart Data Generation using recent items
			const months = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			];
			const monthlyMap: {
				[key: string]: {
					name: string;
					Users: number;
					Outages: number;
					Resolved: number;
				};
			} = {};

			months.forEach((m) => {
				monthlyMap[m] = { name: m, Users: 0, Outages: 0, Resolved: 0 };
			});

			if (responseData?.recent?.users) {
				responseData.recent.users.forEach((user: any) => {
					if (user.createdAt) {
						const monthIndex = new Date(user.createdAt).getMonth();
						const monthName = months[monthIndex];
						if (monthlyMap[monthName]) {
							monthlyMap[monthName].Users += 1;
						}
					}
				});
			}

			if (responseData?.recent?.outages) {
				responseData.recent.outages.forEach((outage: any) => {
					const dateField = outage.createdAt || outage.reportedAt;
					if (dateField) {
						const monthIndex = new Date(dateField).getMonth();
						const monthName = months[monthIndex];
						if (monthlyMap[monthName]) {
							monthlyMap[monthName].Outages += 1;
							if (outage.status === "RESOLVED" || outage.status === "CLOSED") {
								monthlyMap[monthName].Resolved += 1;
							}
						}
					}
				});
			}

			setChartData(Object.values(monthlyMap));
		} catch (error: any) {
			console.error("Failed to load dashboard stats", error);
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text:
					error?.response?.data?.message ||
					"Failed to load dashboard statistics!",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDashboardStats();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
					<FaChartLine className="text-red-600" /> Admin Dashboard Overview
				</h1>
				<p className="text-sm text-gray-500 mt-1">
					Welcome back! Here is a summary of system performance and activities.
				</p>
			</div>

			{/* Stats Grid Cards (All Counts Included) */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{/* Total Users */}
				<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500">Total Users</p>
						<h3 className="text-3xl font-bold text-gray-800 mt-1">
							{stats?.users?.total ?? 0}
						</h3>
						<p className="text-xs text-gray-400 mt-1">
							Active: {stats?.users?.active ?? 0} | Blocked:{" "}
							{stats?.users?.blocked ?? 0}
						</p>
					</div>
					<div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
						<FaUsers size={24} />
					</div>
				</div>

				{/* Roles Breakdown (Admins, Technicians, Customers) */}
				<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500">User Roles</p>
						<div className="text-xs font-semibold text-gray-700 mt-2 space-y-1">
							<p>
								Admins:{" "}
								<span className="text-blue-600">
									{stats?.users?.byRole?.admins ?? 0}
								</span>
							</p>
							<p>
								Technicians:{" "}
								<span className="text-purple-600">
									{stats?.users?.byRole?.technicians ?? 0}
								</span>
							</p>
							<p>
								Customers:{" "}
								<span className="text-green-600">
									{stats?.users?.byRole?.customers ?? 0}
								</span>
							</p>
						</div>
					</div>
					<div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
						<FaUserShield size={24} />
					</div>
				</div>

				{/* Outages (Total, Active, Resolved) */}
				<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500">Outages Summary</p>
						<h3 className="text-3xl font-bold text-gray-800 mt-1">
							{stats?.outages?.total ?? 0}
						</h3>
						<p className="text-xs text-gray-400 mt-1">
							Active: {stats?.outages?.active ?? 0} | Resolved:{" "}
							{stats?.outages?.resolved ?? 0}
						</p>
					</div>
					<div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
						<FaExclamationTriangle size={24} />
					</div>
				</div>

				{/* Schedules */}
				<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500">Schedules</p>
						<h3 className="text-3xl font-bold text-gray-800 mt-1">
							{stats?.schedules?.total ?? 0}
						</h3>
						<p className="text-xs text-gray-400 mt-1">
							Active Schedules: {stats?.schedules?.active ?? 0}
						</p>
					</div>
					<div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
						<FaCalendarAlt size={24} />
					</div>
				</div>

				{/* Assignments */}
				<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between sm:col-span-2 lg:col-span-4">
					<div className="flex items-center justify-between w-full">
						<div>
							<p className="text-sm font-medium text-gray-500">
								Technician Assignments Overview
							</p>
							<div className="flex gap-6 mt-2 text-sm font-semibold text-gray-700">
								<p>
									Total:{" "}
									<span className="text-blue-600">
										{stats?.assignments?.total ?? 0}
									</span>
								</p>
								<p>
									Active:{" "}
									<span className="text-amber-600">
										{stats?.assignments?.active ?? 0}
									</span>
								</p>
								<p>
									Completed:{" "}
									<span className="text-emerald-600">
										{stats?.assignments?.completed ?? 0}
									</span>
								</p>
							</div>
						</div>
						<div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
							<FaTasks size={24} />
						</div>
					</div>
				</div>
			</div>

			{/* Recharts Analytics Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Bar Chart: Outages vs Resolved */}
				<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
							<FaChartBar className="text-red-600" /> Outage & Resolution Trends
						</h3>
					</div>
					<div className="h-80 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={chartData}>
								<CartesianGrid
									strokeDasharray="3 3"
									vertical={false}
									stroke="#f0f0f0"
								/>
								<XAxis dataKey="name" stroke="#888888" fontSize={12} />
								<YAxis stroke="#888888" fontSize={12} />
								<Tooltip />
								<Legend />
								<Bar dataKey="Outages" fill="#f59e0b" radius={[4, 4, 0, 0]} />
								<Bar dataKey="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Line Chart: User Growth */}
				<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
							<FaChartLine className="text-blue-600" /> User Growth Analytics
						</h3>
					</div>
					<div className="h-80 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={chartData}>
								<CartesianGrid
									strokeDasharray="3 3"
									vertical={false}
									stroke="#f0f0f0"
								/>
								<XAxis dataKey="name" stroke="#888888" fontSize={12} />
								<YAxis stroke="#888888" fontSize={12} />
								<Tooltip />
								<Legend />
								<Line
									type="monotone"
									dataKey="Users"
									stroke="#3b82f6"
									strokeWidth={3}
									dot={{ r: 4 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	);
}
