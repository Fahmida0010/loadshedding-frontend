import {
	ArrowRight,
	Bell,
	CheckCircle2,
	Clock,
	ShieldCheck,
	Users,
	Zap,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About Us | Load Shedding & Power Management",
	description:
		"Learn more about our mission to provide accurate power interruption updates and effective load shedding management.",
	openGraph: {
		title: "About Us | Load Shedding & Power Management",
		description: "Learn more about our mission and power management system.",
		type: "website",
	},
};

export default function AboutPage() {
	return (
		<main className="min-h-screen bg-slate-50">
			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
				{/* ================= HERO ================= */}
				<section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 shadow-xl sm:px-10 md:py-20 lg:px-16">
					{/* Background decoration */}
					<div className="absolute inset-0">
						<div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
						<div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

						<div className="absolute right-10 top-10 opacity-10">
							<Zap className="h-52 w-52 text-emerald-400" />
						</div>
					</div>

					<div className="relative z-10 mx-auto max-w-3xl text-center">
						<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
							<span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
							Smart Power Management
						</div>

						<h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
							About{" "}
							<span className="text-emerald-400">
								LoadShedding & power outage management platform
							</span>
						</h1>

						<p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base md:text-lg">
							Empowering communities with real-time power outage tracking,
							automated schedule management, and instant alerts for secure
							electricity distribution.
						</p>
					</div>
				</section>

				{/* ================= MISSION & VISION ================= */}
				<section className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
					{/* Text */}
					<div>
						<div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-600">
							<Zap className="h-4 w-4" />
							Our Purpose
						</div>

						<h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
							Our Mission & Vision
						</h2>

						<div className="mt-6 space-y-5">
							<p className="text-sm leading-7 text-slate-600 sm:text-base">
								In modern power distribution systems, unpredictable outages can
								cause significant disruptions. Our mission is to bridge the
								communication gap between power utility providers and consumers
								by delivering accurate, real-time data and automated
								notifications.
							</p>

							<p className="text-sm leading-7 text-slate-600 sm:text-base">
								We envision a fully transparent energy ecosystem where
								households and businesses can efficiently manage their power
								consumption, minimize downtime, and stay prepared.
							</p>
						</div>

						{/* Small highlights */}
						<div className="mt-7 grid gap-3 sm:grid-cols-2">
							<div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
								<CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
								<span className="text-sm font-medium text-slate-700">
									Accurate Information
								</span>
							</div>

							<div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
								<CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
								<span className="text-sm font-medium text-slate-700">
									Faster Communication
								</span>
							</div>
						</div>
					</div>

					{/* Feature card */}
					<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 p-7 shadow-xl sm:p-9">
						{/* Decorative circles */}
						<div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/20 blur-2xl" />
						<div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-blue-400/20 blur-2xl" />

						<div className="relative space-y-5">
							{/* Real-time */}
							<div className="flex gap-4 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-slate-950">
									<Zap className="h-6 w-6" />
								</div>

								<div>
									<h3 className="font-semibold text-white">
										Real-Time Tracking
									</h3>

									<p className="mt-1 text-sm leading-6 text-blue-100">
										Instant updates on current and upcoming grid outages.
									</p>
								</div>
							</div>

							{/* Security */}
							<div className="flex gap-4 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-300">
									<ShieldCheck className="h-6 w-6" />
								</div>

								<div>
									<h3 className="font-semibold text-white">
										Reliable & Secure
									</h3>

									<p className="mt-1 text-sm leading-6 text-blue-100">
										Built with robust architecture to ensure data integrity.
									</p>
								</div>
							</div>

							{/* Status */}
							<div className="flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4">
								<div className="flex items-center gap-3">
									<span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
									<span className="text-sm font-medium text-emerald-200">
										Power monitoring active
									</span>
								</div>

								<ArrowRight className="h-4 w-4 text-emerald-300" />
							</div>
						</div>
					</div>
				</section>

				{/* ================= FEATURES ================= */}
				<section className="mt-16">
					{/* Section heading */}
					<div className="mx-auto max-w-2xl text-center">
						<div className="mb-3 inline-flex items-center rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
							Our Features
						</div>

						<h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
							What We Offer
						</h2>

						<p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
							Key features designed to keep you ahead of power cuts.
						</p>
					</div>

					{/* Feature cards */}
					<div className="mt-10 grid gap-6 md:grid-cols-3">
						{/* Card 1 */}
						<div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
								<Clock className="h-6 w-6" />
							</div>

							<h3 className="mt-5 text-xl font-bold text-slate-900">
								Area-wise Schedules
							</h3>

							<p className="mt-3 text-sm leading-6 text-slate-600">
								Check detailed load shedding schedules customized for your
								specific zone and locality ahead of time.
							</p>

							<div className="mt-5 flex items-center gap-2 text-xs font-semibold text-blue-600">
								<span>Plan ahead</span>
								<ArrowRight className="h-3.5 w-3.5" />
							</div>
						</div>

						{/* Card 2 */}
						<div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
								<Bell className="h-6 w-6" />
							</div>

							<h3 className="mt-5 text-xl font-bold text-slate-900">
								Instant Alerts
							</h3>

							<p className="mt-3 text-sm leading-6 text-slate-600">
								Receive push notifications and emergency alerts before
								maintenance or emergency power shedding begins.
							</p>

							<div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-600">
								<span>Stay informed</span>
								<ArrowRight className="h-3.5 w-3.5" />
							</div>
						</div>

						{/* Card 3 */}
						<div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white">
								<Users className="h-6 w-6" />
							</div>

							<h3 className="mt-5 text-xl font-bold text-slate-900">
								Role-Based Access
							</h3>

							<p className="mt-3 text-sm leading-6 text-slate-600">
								Dedicated interfaces for Admins, Technicians, and Customers to
								streamline management efficiently.
							</p>

							<div className="mt-5 flex items-center gap-2 text-xs font-semibold text-amber-600">
								<span>Simple management</span>
								<ArrowRight className="h-3.5 w-3.5" />
							</div>
						</div>
					</div>
				</section>

				{/* ================= BOTTOM CTA ================= */}
				<section className="mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
					<div className="flex flex-col items-center justify-between gap-6 px-6 py-8 text-center sm:px-10 md:flex-row md:text-left">
						<div>
							<h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
								Stay prepared for every power interruption.
							</h2>

							<p className="mt-2 max-w-xl text-sm text-slate-500">
								Check your area's schedule and stay updated with the latest
								outage information.
							</p>
						</div>

						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50">
							<Zap className="h-6 w-6 text-emerald-600" />
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
