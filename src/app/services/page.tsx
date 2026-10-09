import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Our Services | Load Shedding & Power Management",
	description:
		"Explore the power management, role-based dashboards, and load shedding notification services we offer.",
};

type Service = {
	id: string;
	icon: string;
	title: string;
	description: string;
	href: string;
	linkText: string;
};

type ServicesProps = {
	services?: Service[];
};

const defaultServices: Service[] = [
	{
		id: "schedule",
		icon: "📅",
		title: "Load shedding schedules",
		description:
			"Find planned interruptions for your area and arrange your day ahead of time.",
		href: "/schedules",
		linkText: "View schedules",
	},
	{
		id: "report",
		icon: "📢",
		title: "Report an outage",
		description:
			"Submit an unexpected power interruption through your customer dashboard.",
		href: "/outages",
		linkText: "Report an issue",
	},
	{
		id: "tracking",
		icon: "🛠️",
		title: "Track repair progress",
		description:
			"Follow outage status updates and available restoration estimates.",
		href: "/outages",
		linkText: "Check updates",
	},
	{
		id: "bills",
		icon: "🧾",
		title: "Manage electricity bills",
		description:
			"Access your bills and available payment options from your account.",
		href: "/dashboard/customer/bills",
		linkText: "View your bills",
	},
];

export default function Services({
	services = defaultServices,
}: ServicesProps) {
	return (
		<section className="bg-white py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mx-auto max-w-2xl text-center">
					<p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
						Our services
					</p>

					<h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
						Your power information, in one place
					</h2>

					<p className="mt-4 text-slate-600">
						Explore schedules and updates, or sign in to manage reports and
						bills.
					</p>
				</div>

				{/* Cards Grid */}
				<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{services.map((service) => (
						<article
							key={service.id}
							className="flex flex-col rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg bg-white"
						>
							<span
								aria-hidden="true"
								className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl"
							>
								{service.icon}
							</span>

							<h3 className="mt-5 text-lg font-bold text-slate-900">
								{service.title}
							</h3>

							<p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
								{service.description}
							</p>

							<Link
								href={service.href}
								className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
							>
								{service.linkText}
								<span aria-hidden="true">→</span>
							</Link>
						</article>
					))}
				</div>

				{/* Storytelling Platform Purpose Section */}
				<div className="mt-20 border-t border-slate-200 pt-16">
					<div className="mx-auto max-w-3xl text-center">
						<span className="inline-block rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-3">
							Platform Ecosystem
						</span>
						<h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
							How Our Power Management Network Operates
						</h3>
						<p className="mt-4 text-base text-slate-600 leading-relaxed">
							Our platform bridges the gap between everyday energy consumers,
							field technicians, and system administrators, creating a unified
							and transparent power grid management cycle.
						</p>
					</div>

					<div className="mt-12 grid gap-8 lg:grid-cols-3">
						{/* Public Access Story */}
						<div className="rounded-3xl bg-slate-50 p-8 border border-slate-200/80 flex flex-col justify-between">
							<div>
								<div className="text-3xl mb-4">🌍</div>
								<h4 className="text-xl font-bold text-slate-900 mb-3">
									Public Accessibility
								</h4>
								<p className="text-sm text-slate-600 leading-relaxed">
									Through our public pages including{" "}
									<strong className="text-slate-900">
										Home, Services, Schedules, and live Outages
									</strong>
									, anyone can stay informed about upcoming power disruptions,
									maintenance calendars, and real-time grid statuses. Users can
									also learn about our mission via{" "}
									<strong className="text-slate-900">About Us</strong> and reach
									support channels through{" "}
									<strong className="text-slate-900">Contact Us</strong>.
								</p>
							</div>
							<div className="mt-6 pt-4 border-t border-slate-200 text-xs font-medium text-emerald-700">
								Open to all visitors & communities
							</div>
						</div>

						{/* Customer & Technician Roles */}
						<div className="rounded-3xl bg-slate-50 p-8 border border-slate-200/80 flex flex-col justify-between">
							<div>
								<div className="text-3xl mb-4">⚡</div>
								<h4 className="text-xl font-bold text-slate-900 mb-3">
									Customer & Field Operations
								</h4>
								<p className="text-sm text-slate-600 leading-relaxed">
									Registered{" "}
									<strong className="text-slate-900">Customers</strong> manage
									profiles, monitor billing, and utilize an advanced outage
									reporting system with live tracking. Meanwhile,{" "}
									<strong className="text-slate-900">Technicians</strong>{" "}
									coordinate via their dedicated dashboard to execute grid
									repair tasks, receive task assignments, and push real-time
									status updates on outage resolutions.
								</p>
							</div>
							<div className="mt-6 pt-4 border-t border-slate-200 text-xs font-medium text-emerald-700">
								Interactive accounts & field dispatch
							</div>
						</div>

						{/* Admin Control */}
						<div className="rounded-3xl bg-slate-50 p-8 border border-slate-200/80 flex flex-col justify-between">
							<div>
								<div className="text-3xl mb-4">🛡️</div>
								<h4 className="text-xl font-bold text-slate-900 mb-3">
									Administrative Command
								</h4>
								<p className="text-sm text-slate-600 leading-relaxed">
									The{" "}
									<strong className="text-slate-900">Admin Dashboard</strong>{" "}
									delivers comprehensive management over Substations, Feeders,
									and Distribution Zones. Administrators handle area
									assignments, user account control, role allocations, and track
									payment histories while evaluating performance through
									system-wide analytics powered by Recharts.
								</p>
							</div>
							<div className="mt-6 pt-4 border-t border-slate-200 text-xs font-medium text-emerald-700">
								Full infrastructure & user oversight
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
