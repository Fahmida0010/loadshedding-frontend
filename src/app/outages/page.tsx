import type { Metadata } from "next";
import OutagesContent from "../components/OutagesContent";

export const metadata: Metadata = {
	title: "Power Outages & Live Updates | Load Shedding",
	description:
		"Check current power outages, emergency maintenance alerts, and live status updates in your area.",
	openGraph: {
		title: "Power Outages & Live Updates | Load Shedding",
		description:
			"Check current power outages and live status updates in your area.",
		type: "website",
	},
};

export default function Page() {
	return <OutagesContent />;
}
