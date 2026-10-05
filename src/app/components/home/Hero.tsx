import Link from "next/link";

type HeroProps = {
  title?: string;
  description?: string;
};

export default function Hero({
  title = "Stay informed. Plan around power interruptions.",
  description = "Check load shedding schedules, follow outage updates, and find the information you need for your area quickly and easily.",
}: HeroProps) {
  return (
    <section className="relative overflow-hidden text-white py-24 lg:py-36">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-slate-950">
        <img
          src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2000&auto=format&fit=crop"
          alt="Power grid and electricity transmission tower"
          className="h-full w-full object-cover object-center opacity-70"
        />

        {/* Dark overlay - lighter than before */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/45 to-slate-950/25" />

        {/* Bottom gradient for smooth section transition */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/60 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Power information for your community
        </span>

        {/* Title */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl">
          {description}
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/schedules"
            className="rounded-xl bg-emerald-400 px-8 py-4 font-semibold text-slate-950 transition-all duration-200 hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/30 active:scale-95"
          >
            Find your schedule
          </Link>

          <Link
            href="/outages"
            className="rounded-xl border border-white/20 bg-slate-950/50 px-8 py-4 font-semibold text-white backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-slate-900/70 active:scale-95"
          >
            Report an outage
          </Link>
        </div>
      </div>
    </section>
  );
}