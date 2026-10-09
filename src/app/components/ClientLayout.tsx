"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	// Jodi dashboard route hoy, tahole public Navbar & Footer hide korbe
	const isDashboardRoute = pathname?.startsWith("/dashboard");

	return (
		<>
			{!isDashboardRoute && <Navbar />}
			<main className="flex-grow">{children}</main>
			{!isDashboardRoute && <Footer />}
		</>
	);
}
