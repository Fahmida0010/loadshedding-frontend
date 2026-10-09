import type { Metadata } from "next";
import AreaSchedule from "./components/home/AreaSchedule";
import EnergyTips from "./components/home/EnergyTips";
import FAQ from "./components/home/FAQ";
import Hero from "./components/home/Hero";
import LiveOutageMap from "./components/home/live/LiveOutageMap";
import Testimonials from "./components/home/Testimonials";

export const metadata: Metadata = {
	title: "Home | Load Shedding & Power Management",
	description:
		"Check load shedding schedules, follow outage updates, and find information for your area quickly and easily.",
	openGraph: {
		title: "Load Shedding & Power Management",
		description: "Stay informed. Plan around power interruptions.",
		type: "website",
	},
};
export default function Home() {
	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-grow">
				<Hero />
				<AreaSchedule />
				<LiveOutageMap />
				<EnergyTips />
				<Testimonials />
				<FAQ />
			</main>
		</div>
	);
}
