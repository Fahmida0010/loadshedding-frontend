// "use client";

// import { useState } from "react";

// export type Schedule = {
//   id: string;
//   area: string;
//   feeder: string;
//   date: string; // Bangladesh local date: YYYY-MM-DD
//   startTime: string; // Display value, e.g. "10:00 AM"
//   endTime: string; // Display value, e.g. "12:00 PM"
//   status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
// };

// type AreaScheduleProps = {
//   schedules: Schedule[];
//   isLoading?: boolean;
//   error?: string | null;
// };

// const statusStyles: Record<Schedule["status"], string> = {
//   SCHEDULED: "bg-blue-50 text-blue-700",
//   ONGOING: "bg-amber-50 text-amber-800",
//   COMPLETED: "bg-emerald-50 text-emerald-700",
//   CANCELLED: "bg-rose-50 text-rose-700",
// };

// const statusLabels: Record<Schedule["status"], string> = {
//   SCHEDULED: "Scheduled",
//   ONGOING: "Ongoing",
//   COMPLETED: "Completed",
//   CANCELLED: "Cancelled",
// };

// export default function AreaSchedule({
//   schedules,
//   isLoading = false,
//   error = null,
// }: AreaScheduleProps) {
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");

//   const areas = [...new Set(schedules.map((item) => item.area))].sort();

//   const filteredSchedules = schedules.filter((item) => {
//     const matchesArea = !selectedArea || item.area === selectedArea;
//     const matchesDate = !selectedDate || item.date === selectedDate;

//     return matchesArea && matchesDate;
//   });

//   function resetFilters() {
//     setSelectedArea("");
//     setSelectedDate("");
//   }

//   return (
//     <section
//       id="area-schedule"
//       className="scroll-mt-24 bg-white py-16 sm:py-20"
//     >
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
//           Plan ahead
//         </p>

//         <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
//           Check your area’s schedule
//         </h2>

//         <p className="mt-4 text-slate-600">
//           Choose an area and date. All times are Bangladesh time (UTC+6).
//         </p>

//         <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-3">
//           <label className="block text-sm font-medium text-slate-700">
//             Area
//             <select
//               value={selectedArea}
//               onChange={(event) => setSelectedArea(event.target.value)}
//               className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:outline-2 focus:outline-emerald-600"
//             >
//               <option value="">All areas</option>

//               {areas.map((area) => (
//                 <option key={area} value={area}>
//                   {area}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <label className="block text-sm font-medium text-slate-700">
//             Date
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(event) => setSelectedDate(event.target.value)}
//               className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:outline-2 focus:outline-emerald-600"
//             />
//           </label>

//           <button
//             type="button"
//             onClick={resetFilters}
//             className="self-end rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
//           >
//             Reset filters
//           </button>
//         </div>

//         {isLoading ? (
//           <p role="status" className="py-12 text-center text-slate-600">
//             Loading schedules...
//           </p>
//         ) : error ? (
//           <p role="alert" className="mt-6 rounded-xl bg-rose-50 p-5 text-rose-700">
//             {error}
//           </p>
//         ) : (
//           <>
//             <p role="status" className="mt-6 text-sm text-slate-500">
//               {filteredSchedules.length} schedule(s) found
//             </p>

//             {filteredSchedules.length === 0 ? (
//               <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center">
//                 <h3 className="font-semibold text-slate-900">
//                   No matching schedules
//                 </h3>
//                 <p className="mt-2 text-slate-600">
//                   Try another area or date.
//                 </p>
//               </div>
//             ) : (
//               <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
//                 {filteredSchedules.map((schedule) => (
//                   <article
//                     key={schedule.id}
//                     className="rounded-2xl border border-slate-200 p-6 transition hover:border-emerald-300 hover:shadow-md"
//                   >
//                     <span
//                       className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[schedule.status]}`}
//                     >
//                       {statusLabels[schedule.status]}
//                     </span>

//                     <h3 className="mt-4 text-xl font-bold text-slate-900">
//                       {schedule.area}
//                     </h3>

//                     <p className="mt-1 text-sm text-slate-500">
//                       Feeder: {schedule.feeder}
//                     </p>

//                     <dl className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
//                       <div className="flex justify-between gap-3">
//                         <dt className="text-slate-500">Date</dt>
//                         <dd className="font-medium text-slate-900">
//                           <time dateTime={schedule.date}>
//                             {schedule.date}
//                           </time>
//                         </dd>
//                       </div>

//                       <div className="flex justify-between gap-3">
//                         <dt className="text-slate-500">Time</dt>
//                         <dd className="text-right font-medium text-slate-900">
//                           {schedule.startTime} – {schedule.endTime}
//                         </dd>
//                       </div>
//                     </dl>
//                   </article>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </section>
//   );
// }