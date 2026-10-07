import Link from "next/link";

type Tip = {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
};

const energyTips: Tip[] = [
  {
    id: "1",
    icon: "🌡️",
    title: "Optimize AC Temperature",
    description: "Set your air conditioner to 24°C - 26°C. Every degree lower increases power consumption by up to 10%.",
    badge: "High Impact",
  },
  {
    id: "2",
    icon: "⚡",
    title: "Shift Heavy Usage to Off-Peak",
    description: "Run washing machines, water heaters, and dishwashers during off-peak hours (late night or early morning).",
    badge: "Grid Saving",
  },
  {
    id: "3",
    icon: "💡",
    title: "Switch to LED Lighting",
    description: "Replace traditional incandescent bulbs with energy-efficient LEDs to cut lighting power usage by up to 80%.",
    badge: "Easy Fix",
  },
];

export default function EnergyTips() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 border-t border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-3">
            Smart Living
          </span>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Energy Efficiency & Peak Hour Tips
          </h2>
          <p className="mt-4 text-slate-600">
            Adopt these simple practices to lower your monthly electricity bills and help stabilize the local power grid.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {energyTips.map((tip) => (
            <div
              key={tip.id}
              className="flex flex-col justify-between rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                    {tip.icon}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {tip.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{tip.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{tip.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Power Saving Guide</span>
                <span className="text-xs text-emerald-700 font-bold">Recommended →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}