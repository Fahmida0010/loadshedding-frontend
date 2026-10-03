import Link from "next/link";

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
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
            Our services
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Your power information, in one place
          </h2>

          <p className="mt-4 text-slate-600">
            Explore schedules and updates, or sign in to manage reports and bills.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.id}
              className="flex flex-col rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
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
      </div>
    </section>
  );
}