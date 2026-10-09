"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/src/store/useAuthStore";
import Loading from "../../loading";

export default function AreaScheduleSection() {
	const { user } = useAuthStore();

	// Fetch only ACTIVE schedules without any filter UI
	const {
		data: schedules = [],
		isLoading,
		error: queryError,
	} = useQuery({
		queryKey: ["schedules", "ACTIVE"],
		queryFn: async () => {
			const res = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/schedules`,
				{
					params: {
						status: "ACTIVE",
					},
				},
			);
			// ব্যাকএন্ডের রেসপন্স ফরম্যাট অনুযায়ী সঠিক অ্যারেটি এক্সট্রাক্ট করা
			return res?.data?.data || res?.data || [];
		},
	});

	if (isLoading) return <Loading />;

	if (queryError) {
		return (
			<div className="max-w-6xl mx-auto p-6 text-center text-red-500">
				<h2 className="text-xl font-bold">Failed to load active schedules</h2>
				<p className="text-sm">
					{(queryError as any)?.message || "Something went wrong."}
				</p>
			</div>
		);
	}

	// শিডিউলগুলো অ্যারে কি না তা নিশ্চিত করার জন্য সেফ চেক
	const scheduleList = Array.isArray(schedules) ? schedules : [];

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
						Active Load Shedding & Outage Schedules ⚡
					</h2>
					<p className="text-sm text-gray-600 mt-1">
						Currently active power disruption schedules across areas.
					</p>
				</div>
			</div>

			{/* Schedules List Grid */}
			{scheduleList.length === 0 ? (
				<div className="bg-white p-10 text-center rounded-2xl border border-gray-100 shadow-sm">
					<p className="text-gray-500 text-sm">
						No active power disruption schedules right now.
					</p>
				</div>
			) : (
				<div className="grid md:grid-cols-2 gap-5">
					{scheduleList.map((item: any) => (
						<div
							key={item.id}
							className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 hover:shadow-md transition-all space-y-4 flex flex-col justify-between relative overflow-hidden"
						>
							{/* Top Accent Line for Active Status */}
							<div className="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>

							<div className="space-y-2">
								<div className="flex justify-between items-start gap-3">
									<div>
										{/* Area Badge */}
										{item.area && (
											<span className="inline-block text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 mb-2 border border-blue-100">
												📍 {item.area.name}{" "}
												{item.area.code ? `• ${item.area.code}` : ""}
											</span>
										)}
										<h3 className="font-bold text-lg text-gray-900 leading-snug">
											{item.title}
										</h3>
									</div>
									<span className="text-xs px-3 py-1 rounded-full border font-semibold shrink-0 bg-red-100 text-red-700 border-red-200 animate-pulse">
										{item.status}
									</span>
								</div>

								<p className="text-sm text-gray-600 leading-relaxed">
									{item.description ||
										"No description provided for this schedule."}
								</p>
							</div>

							<div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
								<div className="flex justify-between">
									<span className="font-medium text-red-600">Start:</span>
									<span>{new Date(item.scheduledStart).toLocaleString()}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-green-600">End:</span>
									<span>{new Date(item.scheduledEnd).toLocaleString()}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
