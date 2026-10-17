"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ContactTrigger } from "@/components/contact/contact-trigger";
import { MobileNav } from "@/components/layout/mobile-nav";
import type { NavLink } from "@/lib/site-config";

type HeaderShellProps = {
	links: NavLink[];
	logo: React.ReactNode;
};

export function HeaderShell({ links, logo }: HeaderShellProps) {
	const [scrolled, setScrolled] = useState(false);
	const [activeHash, setActiveHash] = useState<string | null>(null);
	const pathname = usePathname();

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Destaca a seção visível no menu (apenas na home).
	useEffect(() => {
		if (pathname !== "/") return;
		const ids = links
			.map((l) => l.href.split("#")[1])
			.filter((id): id is string => Boolean(id));
		const sections = ids
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => Boolean(el));
		if (!sections.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setActiveHash(entry.target.id);
				}
			},
			{ rootMargin: "-45% 0px -50% 0px" },
		);
		for (const s of sections) observer.observe(s);
		return () => observer.disconnect();
	}, [links, pathname]);

	return (
		<header
			className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
				scrolled
					? "border-y-line border-b bg-y-navy/85 backdrop-blur-xl"
					: "border-transparent border-b bg-y-navy/0"
			}`}
		>
			<div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
				{logo}

				<nav className="hidden lg:block" aria-label="Menu principal">
					<ul className="flex items-center gap-1 rounded-full border border-y-line bg-white/[0.02] p-1">
						{links.map((link) => {
							const id = link.href.split("#")[1];
							const isActive =
								(id && activeHash === id && pathname === "/") ||
								(!id && pathname.startsWith(link.href));
							return (
								<li key={link.href}>
									<Link
										href={link.href}
										aria-current={isActive ? "true" : undefined}
										className={`inline-flex min-h-9 items-center rounded-full px-4 font-medium text-sm transition-colors ${
											isActive
												? "bg-y-blue/20 text-white"
												: "text-y-muted hover:bg-white/5 hover:text-white"
										}`}
									>
										{link.label}
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				<div className="flex items-center gap-2">
					<ContactTrigger className="y-btn y-btn-primary hidden !min-h-10 !px-4 !text-sm sm:inline-flex">
						Solicitar um projeto
						<ArrowUpRight className="size-4" aria-hidden="true" />
					</ContactTrigger>
					<MobileNav links={links} />
				</div>
			</div>
		</header>
	);
}
