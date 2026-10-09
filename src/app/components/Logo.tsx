import Image from "next/image";
import Link from "next/link";

interface LogoProps {
	className?: string;
	size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
	const sizes = {
		sm: {
			logo: "h-9 w-9",
			title: "text-lg",
			subtitle: "text-[8px]",
		},
		md: {
			logo: "h-11 w-11",
			title: "text-xl",
			subtitle: "text-[9px]",
		},
		lg: {
			logo: "h-14 w-14",
			title: "text-2xl",
			subtitle: "text-[10px]",
		},
	};

	const currentSize = sizes[size];

	return (
		<Link href="/" className={`group flex items-center gap-2 ${className}`}>
			{/* Logo */}
			<div className={`relative shrink-0 ${currentSize.logo}`}>
				<Image
					src="/elec.png"
					alt="Load Shedding Logo"
					fill
					priority
					className="object-contain transition-transform duration-300 group-hover:scale-105"
				/>
			</div>

			{/* Brand Text */}
			<div className="flex flex-col">
				<span
					className={`${currentSize.title} font-bold tracking-tight leading-none`}
				>
					<span className="text-amber-400">Load</span>
					<span className="text-green-500">Shedding </span>
				</span>

				<span
					className={`${currentSize.subtitle} mt-1 font-medium uppercase tracking-[0.20em] text-gray-500`}
				>
					& Power Management
				</span>
			</div>
		</Link>
	);
}
