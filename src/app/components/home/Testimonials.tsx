type Testimonial = {
	id: string;
	name: string;
	role: string;
	company?: string;
	content: string;
	rating: number;
	avatar: string;
};

const testimonials: Testimonial[] = [
	{
		id: "1",
		name: "Tanvir Ahmed",
		role: "Homeowner",
		content:
			"The load shedding schedules are extremely accurate. I can now plan my office work and home appliance usage without sudden power cuts catching me off guard.",
		rating: 5,
		avatar: "👨‍💻",
	},
	{
		id: "2",
		name: "Dr. Farhana Yasmin",
		role: "Local Clinic Manager",
		content:
			"Being able to track outage restoration estimates live and report sudden line faults instantly through the customer dashboard has been a life saver for us.",
		rating: 5,
		avatar: "👩‍⚕️",
	},
	{
		id: "3",
		name: "Rahim Chowdhury",
		role: "Small Business Owner",
		content:
			"Managing electricity bills and checking regional substation updates from a single platform makes power management transparent and hassle-free.",
		rating: 5,
		avatar: "🏪",
	},
];

export default function Testimonials() {
	return (
		<section className="bg-white py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-3">
						Community Trust
					</span>
					<h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
						Trusted by Households & Businesses
					</h2>
					<p className="mt-4 text-slate-600">
						See how our transparent power tracking and scheduling system helps
						people stay prepared every day.
					</p>
				</div>

				<div className="mt-12 grid gap-8 md:grid-cols-3">
					{testimonials.map((item) => (
						<div
							key={item.id}
							className="flex flex-col justify-between rounded-3xl bg-slate-50 p-8 border border-slate-200/80 shadow-sm"
						>
							<div>
								<div className="flex text-amber-500 mb-4 text-sm">
									{Array.from({ length: item.rating }).map((_, i) => (
										<span key={i}>★</span>
									))}
								</div>
								<p className="text-slate-700 text-sm leading-relaxed italic">
									"{item.content}"
								</p>
							</div>

							<div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-3">
								<span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg">
									{item.avatar}
								</span>
								<div>
									<h4 className="font-bold text-slate-900 text-sm">
										{item.name}
									</h4>
									<p className="text-xs text-slate-500">{item.role}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
