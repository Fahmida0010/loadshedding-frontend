import Link from "next/link";

type HeroProps = {
  title?: string;
  description?: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
};

export default function Hero({
  title = "Stay informed. Plan around power interruptions.",
  description = "Check load shedding schedules, follow outage updates, and find the information you need for your area.",
  stats = [],
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <div>
          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
            Power information for your community
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#area-schedule"
              className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Find your schedule
            </a>

            <Link
              href="/dashboard/customer/reports"
              className="rounded-xl border border-slate-600 px-6 py-3 font-semibold transition hover:bg-slate-800"
            >
              Report an outage
            </Link>
          </div>

          {stats.length > 0 && (
            <dl className="mt-10 flex flex-wrap gap-8 border-t border-slate-800 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-sm text-slate-400">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-3xl font-bold text-emerald-300">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Plan your next step
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            Everything starts with your area
          </h2>

          <div className="mt-8 space-y-4">
            {[
              {
                number: "01",
                title: "Find your area",
                description: "Look up the area where you need power updates.",
              },
              {
                number: "02",
                title: "Check the schedule",
                description: "Review planned interruption dates and times.",
              },
              {
                number: "03",
                title: "Follow repair updates",
                description: "Check the progress of reported outages.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="flex gap-4 rounded-2xl bg-slate-800 p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 font-bold text-emerald-300">
                  {step.number}
                </span>

                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}