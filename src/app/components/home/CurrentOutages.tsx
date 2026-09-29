"use client";

import { useState } from "react";

export type Outage = {
  id: string;
  area: string;
  reason: string;
  status: "REPORTED" | "ASSIGNED" | "IN_PROGRESS";
  priority: "LOW" | "MEDIUM" | "HIGH";
  estimatedRestoration: string | null; // ISO timestamp with timezone
};

type CurrentOutagesProps = {
  outages: Outage[];
  isLoading?: boolean;
  error?: string | null;
};

const statusLabels: Record<Outage["status"], string> = {
  REPORTED: "Reported",
  ASSIGNED: "Technician assigned",
  IN_PROGRESS: "Repair in progress",
};

const priorityStyles: Record<Outage["priority"], string> = {
  LOW: "bg-blue-50 text-blue-700",
  MEDIUM: "bg-amber-50 text-amber-800",
  HIGH: "bg-rose-50 text-rose-700",
};

function formatRestoration(value: string | null) {
  if (!value) return "Not available yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available yet";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default function CurrentOutages({
  outages,
  isLoading = false,
  error = null,
}: CurrentOutagesProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredOutages = outages.filter((outage) => {
    const matchesArea = outage.area
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesStatus = status === "ALL" || outage.status === status;

    return matchesArea && matchesStatus;
  });

  return (
    <section id="current-outages" className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
          Outage updates
        </p>

        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          Current power interruptions
        </h2>

        <p className="mt-4 max-w-2xl text-slate-600">
          Follow reported issues and repair progress. Restoration times are
          estimates and may change.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Search area
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="e.g. Amberkhana"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:outline-2 focus:outline-emerald-600"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Repair status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:outline-2 focus:outline-emerald-600"
            >
              <option value="ALL">All active statuses</option>

              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {isLoading ? (
          <p role="status" className="py-12 text-center text-slate-600">
            Loading outage updates...
          </p>
        ) : error ? (
          <p role="alert" className="mt-6 rounded-xl bg-rose-50 p-5 text-rose-700">
            {error}
          </p>
        ) : (
          <>
            <p role="status" className="mt-6 text-sm text-slate-500">
              {filteredOutages.length} matching outage(s)
            </p>

            {filteredOutages.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <h3 className="font-semibold text-slate-900">
                  No matching outage reports
                </h3>
                <p className="mt-2 text-slate-600">
                  Missing reports do not confirm power availability.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredOutages.map((outage) => (
                  <article
                    key={outage.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[outage.priority]}`}
                      >
                        {outage.priority.toLowerCase()} priority
                      </span>

                      <span className="text-xs text-slate-500">
                        {outage.id}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-slate-900">
                      {outage.area}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {outage.reason}
                    </p>

                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-emerald-700">
                        {statusLabels[outage.status]}
                      </p>

                      <p className="mt-3 text-xs text-slate-500">
                        Estimated restoration · Bangladesh time
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {formatRestoration(outage.estimatedRestoration)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}