import type { Metadata } from "next";
import ContactContent from "../components/ContactContent";

export const metadata: Metadata = {
	title: "Contact Us & Support | Load Shedding",
	description:
		"Get in touch with our support team to report power outages, feedback, or inquiries regarding load shedding schedules.",
	openGraph: {
		title: "Contact Us & Support | Load Shedding",
		description: "Get in touch with our support team to report power outages.",
		type: "website",
	},
};

export default function Page() {
	return <ContactContent />;
}
