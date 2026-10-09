"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import Loading from "@/src/app/loading";
import { useAxiosSecure } from "@/src/hooks/useAxiosSecure";
import { useAuthStore } from "@/src/store/useAuthStore";

interface ISchedule {
	id: string;
	title: string;
	description?: string;
	type: "LOAD_SHEDDING" | "PLANNED_OUTAGE";
	priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
	scheduledStart: string;
	scheduledEnd: string;
	status: "SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
	area: {
		id: string;
		name: string;
		code: string;
		location?: string;
	};
}

interface IArea {
	id: string;
	name: string;
	code: string;
}

export default function AdminSchedulesPage() {
	const { user } = useAuthStore();
	const axiosSecure = useAxiosSecure();
	const queryClient = useQueryClient();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
		null,
	);

	const [formData, setFormData] = useState({
		areaId: "",
		title: "",
		description: "",
		type: "LOAD_SHEDDING",
		priority: "MEDIUM",
		scheduledStart: "",
		scheduledEnd: "",
		status: "SCHEDULED",
	});

	// Helper to format ISO date string for datetime-local input (YYYY-MM-DDTHH:mm)
	const formatForDatetimeLocal = (isoString: string) => {
		if (!isoString) return "";
		const date = new Date(isoString);
		const tzOffset = date.getTimezoneOffset() * 60000;
		const localISOTime = new Date(date.getTime() - tzOffset)
			.toISOString()
			.slice(0, 16);
		return localISOTime;
	};

	// 1. Fetch all schedules
	const { data: schedulesRes, isLoading } = useQuery({
		queryKey: ["admin-schedules"],
		queryFn: async () => {
			const res = await axiosSecure.get("/schedules");
			return res.data;
		},
	});

	// 2. Fetch areas for dropdown selection
	const { data: areasRes } = useQuery({
		queryKey: ["areas-list"],
		queryFn: async () => {
			const res = await axiosSecure.get("/areas");
			return res.data;
		},
	});

	const schedules: ISchedule[] = Array.isArray(schedulesRes)
		? schedulesRes
		: schedulesRes?.data || [];

	const areas: IArea[] = Array.isArray(areasRes)
		? areasRes
		: areasRes?.data || [];

	// 3. Create Schedule Mutation
	const createMutation = useMutation({
		mutationFn: async (newSchedule: typeof formData) => {
			const res = await axiosSecure.post("/schedules", newSchedule);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-schedules"] });
			closeModal();
			Swal.fire({
				icon: "success",
				title: "Success!",
				text: "Schedule created successfully!",
				timer: 2000,
				showConfirmButton: false,
			});
		},
		onError: (err: any) => {
			const errorData = err?.response?.data;
			let errorMessage = "Failed to create schedule";
			if (Array.isArray(errorData?.message)) {
				errorMessage = errorData.message.join("\n");
			} else if (errorData?.errors) {
				errorMessage = Object.values(errorData.errors).flat().join("\n");
			} else if (errorData?.message) {
				errorMessage = errorData.message;
			}
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: errorMessage,
			});
		},
	});

	// 4. Update Schedule Mutation
	const updateMutation = useMutation({
		async mutationFn({ id, data }: { id: string; data: typeof formData }) {
			const res = await axiosSecure.patch(`/schedules/${id}`, data);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-schedules"] });
			closeModal();
			Swal.fire({
				icon: "success",
				title: "Updated!",
				text: "Schedule updated successfully!",
				timer: 2000,
				showConfirmButton: false,
			});
		},
		onError: (err: any) => {
			const errorData = err?.response?.data;
			let errorMessage = "Failed to update schedule";
			if (Array.isArray(errorData?.message)) {
				errorMessage = errorData.message.join("\n");
			} else if (errorData?.message) {
				errorMessage = errorData.message;
			}
			Swal.fire({
				icon: "error",
				title: "Error",
				text: errorMessage,
			});
		},
	});

	// 5. Delete Schedule Mutation
	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosSecure.delete(`/schedules/${id}`);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-schedules"] });
			Swal.fire({
				icon: "success",
				title: "Deleted!",
				text: "Schedule has been deleted.",
				timer: 2000,
				showConfirmButton: false,
			});
		},
		onError: (err: any) => {
			Swal.fire({
				icon: "error",
				title: "Failed",
				text: err?.response?.data?.message || "Failed to delete schedule",
			});
		},
	});

	const openCreateModal = () => {
		setIsEditMode(false);
		setSelectedScheduleId(null);
		setFormData({
			areaId: "",
			title: "",
			description: "",
			type: "LOAD_SHEDDING",
			priority: "MEDIUM",
			scheduledStart: "",
			scheduledEnd: "",
			status: "SCHEDULED",
		});
		setIsModalOpen(true);
	};

	const openEditModal = (item: ISchedule) => {
		setIsEditMode(true);
		setSelectedScheduleId(item.id);
		setFormData({
			areaId: item.area?.id || "",
			title: item.title || "",
			description: item.description || "",
			type: item.type || "LOAD_SHEDDING",
			priority: item.priority || "MEDIUM",
			scheduledStart: formatForDatetimeLocal(item.scheduledStart),
			scheduledEnd: formatForDatetimeLocal(item.scheduledEnd),
			status: item.status || "SCHEDULED",
		});
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setIsEditMode(false);
		setSelectedScheduleId(null);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (isEditMode && selectedScheduleId) {
			updateMutation.mutate({ id: selectedScheduleId, data: formData });
		} else {
			createMutation.mutate(formData);
		}
	};

	const handleDelete = (id: string) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		}).then((result) => {
			if (result.isConfirmed) {
				deleteMutation.mutate(id);
			}
		});
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
				<div>
					<h1 className="text-xl md:text-2xl font-bold text-gray-800">
						Manage Load Shedding Schedules
					</h1>
					<p className="text-xs md:text-sm text-gray-500">
						Create, update or monitor power outage schedules as an Admin.
					</p>
				</div>
				<button
					onClick={openCreateModal}
					className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
				>
					+ Create New Schedule
				</button>
			</div>

			{/* Responsive View: Cards for small screens, Table for large screens */}
			{schedules.length === 0 ? (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
					No schedules found.
				</div>
			) : (
				<>
					{/* Small Screen: Card View */}
					<div className="grid grid-cols-1 gap-4 md:hidden">
						{schedules.map((item) => (
							<div
								key={item.id}
								className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3"
							>
								<div className="flex justify-between items-start">
									<div>
										<h2 className="font-semibold text-gray-800 text-base">
											{item.title}
										</h2>
										<p className="text-xs text-blue-600">
											📍 {item.area?.name} ({item.area?.code})
										</p>
									</div>
									<span className="px-2 py-0.5 text-xs rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200">
										{item.status}
									</span>
								</div>

								<div className="flex flex-wrap gap-2 text-xs">
									<span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-medium">
										{item.type}
									</span>
									<span className="px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 rounded font-semibold uppercase">
										Priority: {item.priority}
									</span>
								</div>

								<div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-2.5 rounded-lg">
									<p>
										<strong>Start:</strong>{" "}
										{new Date(item.scheduledStart).toLocaleString()}
									</p>
									<p>
										<strong>End:</strong>{" "}
										{new Date(item.scheduledEnd).toLocaleString()}
									</p>
								</div>

								<div className="flex justify-end gap-2 pt-2 border-t">
									<button
										onClick={() => openEditModal(item)}
										className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition"
									>
										Edit / Details
									</button>
									<button
										onClick={() => handleDelete(item.id)}
										className="text-red-600 hover:text-red-800 text-xs font-semibold px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition"
									>
										Delete
									</button>
								</div>
							</div>
						))}
					</div>

					{/* Large Screen: Table View */}
					<div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-600 uppercase tracking-wider">
									<th className="p-4">Title & Area</th>
									<th className="p-4">Type / Priority</th>
									<th className="p-4">Time Period</th>
									<th className="p-4">Status</th>
									<th className="p-4 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 text-sm">
								{schedules.map((item) => (
									<tr key={item.id} className="hover:bg-gray-50">
										<td className="p-4">
											<p className="font-semibold text-gray-800">
												{item.title}
											</p>
											<p className="text-xs text-blue-600">
												📍 {item.area?.name} ({item.area?.code})
											</p>
										</td>
										<td className="p-4">
											<span className="inline-block px-2 py-0.5 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded font-medium mb-1">
												{item.type}
											</span>
											<p className="text-xs text-gray-500 uppercase font-semibold">
												Priority: {item.priority}
											</p>
										</td>
										<td className="p-4 text-xs text-gray-600">
											<p>
												<strong>Start:</strong>{" "}
												{new Date(item.scheduledStart).toLocaleString()}
											</p>
											<p>
												<strong>End:</strong>{" "}
												{new Date(item.scheduledEnd).toLocaleString()}
											</p>
										</td>
										<td className="p-4">
											<span className="px-2.5 py-1 text-xs rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200">
												{item.status}
											</span>
										</td>
										<td className="p-4 text-right space-x-2">
											<button
												onClick={() => openEditModal(item)}
												className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition"
											>
												Edit / Details
											</button>
											<button
												onClick={() => handleDelete(item.id)}
												className="text-red-600 hover:text-red-800 text-xs font-semibold px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition"
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			)}

			{/* Modal for Creating & Updating Schedule (including Status update) */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
						<h2 className="text-xl font-bold text-gray-800 mb-4">
							{isEditMode
								? "Update Load Shedding Schedule"
								: "Create Load Shedding Schedule"}
						</h2>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
									Select Area
								</label>
								<select
									required
									value={formData.areaId}
									onChange={(e) =>
										setFormData({ ...formData, areaId: e.target.value })
									}
									className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
								>
									<option value="">-- Choose Area --</option>
									{areas.map((area) => (
										<option key={area.id} value={area.id}>
											{area.name} ({area.code})
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
									Title
								</label>
								<input
									type="text"
									required
									placeholder="e.g. Emergency Maintenance in Uposhohor"
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
									Description
								</label>
								<textarea
									rows={2}
									placeholder="Details about the outage..."
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
										Type
									</label>
									<select
										value={formData.type}
										onChange={(e) =>
											setFormData({ ...formData, type: e.target.value as any })
										}
										className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
									>
										<option value="LOAD_SHEDDING">LOAD SHEDDING</option>
										<option value="PLANNED_OUTAGE">PLANNED OUTAGE</option>
									</select>
								</div>
								<div>
									<label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
										Priority
									</label>
									<select
										value={formData.priority}
										onChange={(e) =>
											setFormData({
												...formData,
												priority: e.target.value as any,
											})
										}
										className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
									>
										<option value="LOW">LOW</option>
										<option value="MEDIUM">MEDIUM</option>
										<option value="HIGH">HIGH</option>
										<option value="URGENT">URGENT</option>
									</select>
								</div>
							</div>

							{/* Status Update Field */}
							<div>
								<label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
									Status
								</label>
								<select
									value={formData.status}
									onChange={(e) =>
										setFormData({ ...formData, status: e.target.value as any })
									}
									className="w-full border rounded-lg p-2.5 text-sm bg-gray-50 font-semibold text-blue-700"
								>
									<option value="SCHEDULED">SCHEDULED</option>
									<option value="ACTIVE">ACTIVE</option>
									<option value="COMPLETED">COMPLETED</option>
									<option value="CANCELLED">CANCELLED</option>
								</select>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
										Start Time
									</label>
									<input
										type="datetime-local"
										required
										value={formData.scheduledStart}
										onChange={(e) =>
											setFormData({
												...formData,
												scheduledStart: e.target.value,
											})
										}
										className="w-full border rounded-lg p-2 text-sm bg-gray-50"
									/>
								</div>
								<div>
									<label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
										End Time
									</label>
									<input
										type="datetime-local"
										required
										value={formData.scheduledEnd}
										onChange={(e) =>
											setFormData({ ...formData, scheduledEnd: e.target.value })
										}
										className="w-full border rounded-lg p-2 text-sm bg-gray-50"
									/>
								</div>
							</div>

							<div className="flex justify-end gap-3 mt-6 pt-4 border-t">
								<button
									type="button"
									onClick={closeModal}
									className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={
										createMutation.isPending || updateMutation.isPending
									}
									className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
								>
									{createMutation.isPending || updateMutation.isPending
										? "Saving..."
										: isEditMode
											? "Update Schedule"
											: "Save Schedule"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
