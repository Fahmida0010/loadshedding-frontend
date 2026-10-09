"use client";

import { useQuery } from "@tanstack/react-query";
import {
	Activity,
	AlertCircle,
	ChevronLeft,
	ChevronRight,
	Clock,
	Database,
	Eye,
	FileText,
	Globe,
	RefreshCw,
	Search,
	ShieldCheck,
	User,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAxiosSecure } from "@/src/hooks/useAxiosSecure";

interface AuditLog {
	id: string;
	userId: string | null;
	action: string;
	entityType: string;
	entityId: string | null;
	oldValues: Record<string, unknown> | null;
	newValues: Record<string, unknown> | null;
	ipAddress: string | null;
	userAgent: string | null;
	createdAt: string;

	user?: {
		id: string;
		name?: string | null;
		email?: string | null;
	} | null;
}

interface AuditLogResponse {
	success: boolean;
	message?: string;
	data: AuditLog[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

const getActionStyle = (action: string) => {
	const value = action.toUpperCase();

	if (
		value.includes("DELETE") ||
		value.includes("REMOVE") ||
		value.includes("CANCEL")
	) {
		return "bg-red-50 text-red-700 border-red-200";
	}

	if (
		value.includes("CREATE") ||
		value.includes("ADD") ||
		value.includes("REGISTER")
	) {
		return "bg-green-50 text-green-700 border-green-200";
	}

	if (
		value.includes("UPDATE") ||
		value.includes("EDIT") ||
		value.includes("MODIFY")
	) {
		return "bg-blue-50 text-blue-700 border-blue-200";
	}

	if (
		value.includes("LOGIN") ||
		value.includes("LOGOUT") ||
		value.includes("AUTH")
	) {
		return "bg-purple-50 text-purple-700 border-purple-200";
	}

	return "bg-gray-50 text-gray-700 border-gray-200";
};

const formatDate = (date: string) => {
	try {
		return new Date(date).toLocaleString("en-BD", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return "Unknown";
	}
};

const truncateId = (id: string | null, length = 12) => {
	if (!id) return "—";

	if (id.length <= length) return id;

	return `${id.slice(0, length)}...`;
};

const formatJson = (value: unknown) => {
	if (!value) return "No data";

	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return "Unable to display data";
	}
};

// ======================================================
// Page
// ======================================================

export default function AuditLogsPage() {
	const [page, setPage] = useState(1);
	const [limit] = useState(10);

	const [searchTerm, setSearchTerm] = useState("");
	const [search, setSearch] = useState("");

	const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
	const axiosSecure = useAxiosSecure();

	// ====================================================
	// Fetch Audit Logs
	// ====================================================
	const { data, isLoading, isFetching, isError, error, refetch } =
		useQuery<AuditLogResponse>({
			queryKey: ["audit-logs", page, limit, search],

			queryFn: async () => {
				const response = await axiosSecure.get("/admin/audit-logs", {
					params: {
						page,
						limit,
						...(search.trim() && {
							searchTerm: search.trim(),
						}),
					},
				});

				return response.data;
			},

			staleTime: 30 * 1000,
		});

	// ====================================================
	// Data
	// ====================================================

	const logs = data?.data ?? [];

	const meta = data?.meta ?? {
		page: 1,
		limit,
		total: 0,
		totalPages: 1,
	};

	// ====================================================
	// Pagination
	// ====================================================

	const totalPages = Math.max(meta.totalPages || 1, 1);

	const paginationPages = useMemo(() => {
		const pages: number[] = [];

		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}

			return pages;
		}

		if (page <= 3) {
			return [1, 2, 3, 4, 5];
		}

		if (page >= totalPages - 2) {
			return [
				totalPages - 4,
				totalPages - 3,
				totalPages - 2,
				totalPages - 1,
				totalPages,
			];
		}

		return [page - 2, page - 1, page, page + 1, page + 2];
	}, [page, totalPages]);

	// ====================================================
	// Search
	// ====================================================

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setPage(1);
		setSearch(searchTerm.trim());
	};

	const clearSearch = () => {
		setSearchTerm("");
		setSearch("");
		setPage(1);
	};

	// ====================================================
	// Loading State
	// ====================================================

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
				<div className="mx-auto max-w-7xl">
					<div className="mb-6 h-10 w-64 animate-pulse rounded-lg bg-gray-200" />

					<div className="mb-6 h-24 animate-pulse rounded-2xl bg-white shadow-sm" />

					<div className="overflow-hidden rounded-2xl bg-white shadow-sm">
						<div className="space-y-4 p-6">
							{Array.from({ length: 8 }).map((_, index) => (
								<div
									key={index}
									className="h-14 animate-pulse rounded-lg bg-gray-100"
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	// ====================================================
	// Main UI
	// ====================================================

	return (
		<div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-7xl">
				{/* =================================================
            Header
        ================================================= */}

				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="flex items-center gap-3">
							<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm">
								<ShieldCheck size={23} />
							</div>

							<div>
								<h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
									Audit Logs
								</h1>

								<p className="mt-1 text-sm text-gray-500">
									Monitor administrative activities and system changes.
								</p>
							</div>
						</div>
					</div>

					<button
						type="button"
						onClick={() => refetch()}
						disabled={isFetching}
						className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
					>
						<RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
						Refresh
					</button>
				</div>

				{/* =================================================
            Statistics
        ================================================= */}

				<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500">Total Activities</p>

								<p className="mt-1 text-2xl font-bold text-gray-900">
									{meta.total}
								</p>
							</div>

							<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
								<Activity size={21} />
							</div>
						</div>
					</div>

					<div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500">Current Page</p>

								<p className="mt-1 text-2xl font-bold text-gray-900">
									{meta.page} / {totalPages}
								</p>
							</div>

							<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
								<FileText size={21} />
							</div>
						</div>
					</div>

					<div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500">Showing</p>

								<p className="mt-1 text-2xl font-bold text-gray-900">
									{logs.length}
								</p>
							</div>

							<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
								<Database size={21} />
							</div>
						</div>
					</div>
				</div>

				{/* =================================================
            Search
        ================================================= */}

				<div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
					<form
						onSubmit={handleSearch}
						className="flex flex-col gap-3 sm:flex-row"
					>
						<div className="relative flex-1">
							<Search
								size={18}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
							/>

							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Search by action, entity type, entity ID..."
								className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
							/>
						</div>

						<button
							type="submit"
							className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 text-sm font-medium text-white transition hover:bg-gray-800"
						>
							<Search size={17} />
							Search
						</button>

						{search && (
							<button
								type="button"
								onClick={clearSearch}
								className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
							>
								<X size={17} />
								Clear
							</button>
						)}
					</form>
				</div>

				{/* =================================================
            Error
        ================================================= */}

				{isError && (
					<div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
						<AlertCircle size={20} className="mt-0.5 shrink-0" />

						<div>
							<p className="font-semibold">Failed to load audit logs</p>

							<p className="mt-1 text-sm">
								{error instanceof Error
									? error.message
									: "Something went wrong while loading audit logs."}
							</p>
						</div>
					</div>
				)}

				{/* =================================================
            Desktop Table
        ================================================= */}

				<div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[1100px]">
							<thead>
								<tr className="border-b border-gray-100 bg-gray-50/80">
									<th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
										Action
									</th>

									<th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
										Entity
									</th>

									<th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
										User
									</th>

									<th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
										IP Address
									</th>

									<th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
										Date
									</th>

									<th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
										Details
									</th>
								</tr>
							</thead>

							<tbody className="divide-y divide-gray-100">
								{logs.map((log) => (
									<tr key={log.id} className="transition hover:bg-gray-50/70">
										{/* Action */}

										<td className="px-5 py-4">
											<span
												className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${getActionStyle(
													log.action,
												)}`}
											>
												{log.action}
											</span>
										</td>

										{/* Entity */}

										<td className="px-5 py-4">
											<div>
												<p className="text-sm font-medium text-gray-900">
													{log.entityType}
												</p>

												<p
													className="mt-1 max-w-[180px] truncate font-mono text-xs text-gray-400"
													title={log.entityId ?? ""}
												>
													{truncateId(log.entityId)}
												</p>
											</div>
										</td>

										{/* User */}

										<td className="px-5 py-4">
											<div className="flex items-center gap-2">
												<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
													<User size={15} />
												</div>

												<div className="min-w-0">
													<p className="max-w-[160px] truncate text-sm font-medium text-gray-800">
														{log.user?.name || log.user?.email || "System"}
													</p>

													{log.userId && (
														<p className="max-w-[160px] truncate font-mono text-xs text-gray-400">
															{truncateId(log.userId, 10)}
														</p>
													)}
												</div>
											</div>
										</td>

										{/* IP */}

										<td className="px-5 py-4">
											<div className="flex items-center gap-2 text-sm text-gray-600">
												<Globe size={15} className="text-gray-400" />

												{log.ipAddress || "—"}
											</div>
										</td>

										{/* Date */}

										<td className="px-5 py-4">
											<div className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-600">
												<Clock size={15} className="text-gray-400" />

												{formatDate(log.createdAt)}
											</div>
										</td>

										{/* Details */}

										<td className="px-5 py-4 text-right">
											<button
												type="button"
												onClick={() => setSelectedLog(log)}
												className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
											>
												<Eye size={15} />
												View
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Desktop Empty */}

					{logs.length === 0 && !isError && (
						<div className="flex flex-col items-center justify-center px-6 py-16 text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
								<FileText size={25} />
							</div>

							<h3 className="font-semibold text-gray-900">
								No audit logs found
							</h3>

							<p className="mt-1 max-w-sm text-sm text-gray-500">
								{search
									? "No audit logs matched your search."
									: "There are no audit logs available yet."}
							</p>
						</div>
					)}
				</div>

				{/* =================================================
            Mobile / Tablet Cards
        ================================================= */}

				<div className="space-y-4 lg:hidden">
					{logs.map((log) => (
						<div
							key={log.id}
							className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
						>
							{/* Card Header */}

							<div className="flex items-start justify-between gap-3">
								<span
									className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${getActionStyle(
										log.action,
									)}`}
								>
									{log.action}
								</span>

								<button
									type="button"
									onClick={() => setSelectedLog(log)}
									className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
								>
									<Eye size={14} />
									View
								</button>
							</div>

							{/* Entity */}

							<div className="mt-5">
								<p className="text-xs font-medium uppercase tracking-wide text-gray-400">
									Entity
								</p>

								<p className="mt-1 text-sm font-semibold text-gray-900">
									{log.entityType}
								</p>

								{log.entityId && (
									<p className="mt-1 break-all font-mono text-xs text-gray-400">
										{log.entityId}
									</p>
								)}
							</div>

							{/* Information */}

							<div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2">
								<div className="flex items-start gap-3">
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
										<User size={15} />
									</div>

									<div className="min-w-0">
										<p className="text-xs text-gray-400">User</p>

										<p className="mt-0.5 truncate text-sm font-medium text-gray-800">
											{log.user?.name || log.user?.email || "System"}
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
										<Globe size={15} />
									</div>

									<div className="min-w-0">
										<p className="text-xs text-gray-400">IP Address</p>

										<p className="mt-0.5 truncate text-sm font-medium text-gray-800">
											{log.ipAddress || "—"}
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3 sm:col-span-2">
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
										<Clock size={15} />
									</div>

									<div>
										<p className="text-xs text-gray-400">Date & Time</p>

										<p className="mt-0.5 text-sm font-medium text-gray-800">
											{formatDate(log.createdAt)}
										</p>
									</div>
								</div>
							</div>
						</div>
					))}

					{/* Mobile Empty */}

					{logs.length === 0 && !isError && (
						<div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
							<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
								<FileText size={25} />
							</div>

							<h3 className="font-semibold text-gray-900">
								No audit logs found
							</h3>

							<p className="mt-1 text-sm text-gray-500">
								{search
									? "No logs matched your search."
									: "No audit logs are available yet."}
							</p>
						</div>
					)}
				</div>

				{/* =================================================
            Pagination
        ================================================= */}

				{meta.total > 0 && (
					<div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
						<p className="text-sm text-gray-500">
							Showing{" "}
							<span className="font-medium text-gray-900">
								{(meta.page - 1) * meta.limit + 1}
							</span>{" "}
							to{" "}
							<span className="font-medium text-gray-900">
								{Math.min(meta.page * meta.limit, meta.total)}
							</span>{" "}
							of <span className="font-medium text-gray-900">{meta.total}</span>
						</p>

						<div className="flex items-center gap-1">
							{/* Previous */}

							<button
								type="button"
								disabled={page <= 1 || isFetching}
								onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
								className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
							>
								<ChevronLeft size={17} />
							</button>

							{/* Pages */}

							{paginationPages.map((pageNumber) => (
								<button
									key={pageNumber}
									type="button"
									onClick={() => setPage(pageNumber)}
									disabled={isFetching}
									className={`hidden h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition sm:flex ${
										pageNumber === page
											? "bg-gray-900 text-white"
											: "border border-gray-200 text-gray-600 hover:bg-gray-50"
									}`}
								>
									{pageNumber}
								</button>
							))}

							{/* Mobile page indicator */}

							<span className="flex h-9 items-center px-2 text-sm font-medium text-gray-700 sm:hidden">
								{page} / {totalPages}
							</span>

							{/* Next */}

							<button
								type="button"
								disabled={page >= totalPages || isFetching}
								onClick={() =>
									setPage((prev) => Math.min(prev + 1, totalPages))
								}
								className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
							>
								<ChevronRight size={17} />
							</button>
						</div>
					</div>
				)}
			</div>

			{/* ===================================================
          Details Modal
      =================================================== */}

			{selectedLog && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
					onClick={() => setSelectedLog(null)}
				>
					<div
						className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Modal Header */}

						<div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">
									<FileText size={19} />
								</div>

								<div>
									<h2 className="font-semibold text-gray-900">
										Audit Log Details
									</h2>

									<p className="text-xs text-gray-500">
										Complete activity information
									</p>
								</div>
							</div>

							<button
								type="button"
								onClick={() => setSelectedLog(null)}
								className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
							>
								<X size={19} />
							</button>
						</div>

						{/* Modal Content */}

						<div className="max-h-[calc(90vh-73px)] overflow-y-auto p-5 sm:p-6">
							{/* Basic Info */}

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
									<p className="text-xs font-medium uppercase tracking-wide text-gray-400">
										Action
									</p>

									<span
										className={`mt-2 inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${getActionStyle(
											selectedLog.action,
										)}`}
									>
										{selectedLog.action}
									</span>
								</div>

								<div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
									<p className="text-xs font-medium uppercase tracking-wide text-gray-400">
										Entity Type
									</p>

									<p className="mt-2 text-sm font-semibold text-gray-900">
										{selectedLog.entityType}
									</p>
								</div>

								<div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
									<p className="text-xs font-medium uppercase tracking-wide text-gray-400">
										Entity ID
									</p>

									<p className="mt-2 break-all font-mono text-xs text-gray-700">
										{selectedLog.entityId || "—"}
									</p>
								</div>

								<div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
									<p className="text-xs font-medium uppercase tracking-wide text-gray-400">
										User ID
									</p>

									<p className="mt-2 break-all font-mono text-xs text-gray-700">
										{selectedLog.userId || "System"}
									</p>
								</div>

								<div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
									<p className="text-xs font-medium uppercase tracking-wide text-gray-400">
										IP Address
									</p>

									<p className="mt-2 text-sm font-medium text-gray-800">
										{selectedLog.ipAddress || "—"}
									</p>
								</div>

								<div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
									<p className="text-xs font-medium uppercase tracking-wide text-gray-400">
										Created At
									</p>

									<p className="mt-2 text-sm font-medium text-gray-800">
										{formatDate(selectedLog.createdAt)}
									</p>
								</div>
							</div>

							{/* Old Values */}

							<div className="mt-6">
								<div className="mb-2 flex items-center justify-between">
									<h3 className="text-sm font-semibold text-gray-900">
										Old Values
									</h3>
								</div>

								<pre className="max-h-64 overflow-auto rounded-xl bg-gray-950 p-4 text-xs leading-6 text-gray-200">
									{formatJson(selectedLog.oldValues)}
								</pre>
							</div>

							{/* New Values */}

							<div className="mt-6">
								<h3 className="mb-2 text-sm font-semibold text-gray-900">
									New Values
								</h3>

								<pre className="max-h-64 overflow-auto rounded-xl bg-gray-950 p-4 text-xs leading-6 text-gray-200">
									{formatJson(selectedLog.newValues)}
								</pre>
							</div>

							{/* User Agent */}

							<div className="mt-6">
								<h3 className="mb-2 text-sm font-semibold text-gray-900">
									User Agent
								</h3>

								<div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
									<p className="break-all text-xs leading-5 text-gray-600">
										{selectedLog.userAgent || "—"}
									</p>
								</div>
							</div>

							{/* Log ID */}

							<div className="mt-6">
								<h3 className="mb-2 text-sm font-semibold text-gray-900">
									Audit Log ID
								</h3>

								<div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
									<p className="break-all font-mono text-xs text-gray-600">
										{selectedLog.id}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
