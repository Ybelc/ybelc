"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { ContactTrigger } from "@/components/contact/contact-trigger";
import { baseNavLinks, type NavLink } from "@/lib/site-config";

type MobileNavProps = {
	links?: NavLink[];
	/** @deprecated mantido por compatibilidade com componentes legados. */
	accessHref?: string;
};

export function MobileNav({ links = baseNavLinks }: MobileNavProps) {
	const [open, setOpen] = useState(false);
	const panelId = useId();
	const toggleRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLElement>(null);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		if (open) {
			panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
		}
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape" && open) {
				setOpen(false);
				toggleRef.current?.focus();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKey);
		};
	}, [open]);

	useEffect(() => {
		const mq = window.matchMedia("(min-width: 1024px)");
		const onChange = () => mq.matches && setOpen(false);
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);

	return (
		<div className="lg:hidden">
			<button
				ref={toggleRef}
				type="button"
				className="relative z-[52] flex size-11 items-center justify-center rounded-xl border border-y-line bg-white/[0.03] text-y-fg transition-colors hover:bg-white/[0.07]"
				aria-expanded={open}
				aria-controls={panelId}
				aria-label={open ? "Fechar menu" : "Abrir menu"}
				onClick={() => setOpen((prev) => !prev)}
			>
				{open ? <X className="size-5" /> : <Menu className="size-5" />}
			</button>

			<div
				className={`fixed inset-0 top-[4.5rem] z-40 bg-y-ink/70 backdrop-blur-sm transition-opacity duration-300 ${
					open ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
				aria-hidden="true"
				onClick={() => setOpen(false)}
			/>
			<nav
				ref={panelRef}
				id={panelId}
				aria-label="Menu principal"
				hidden={!open}
				className="fixed inset-x-0 top-[4.5rem] z-50 border-y-line border-b bg-y-navy/95 px-4 pt-4 pb-6 backdrop-blur-xl sm:px-6"
			>
				<ul className="flex flex-col">
					{links.map((link, i) => (
						<li key={link.href} className="border-y-line border-b last:border-b-0">
							<Link
								href={link.href}
								className="flex min-h-14 items-center justify-between font-display font-medium text-lg text-y-fg"
								onClick={() => setOpen(false)}
							>
								<span>{link.label}</span>
								<span className="font-mono text-xs text-y-muted">{String(i + 1).padStart(2, "0")}</span>
							</Link>
						</li>
					))}
				</ul>
				<ContactTrigger
					className="y-btn y-btn-primary mt-5 w-full"
					onAfterOpen={() => setOpen(false)}
				>
					Solicitar um projeto
					<ArrowUpRight className="size-4" aria-hidden="true" />
				</ContactTrigger>
			</nav>
		</div>
	);
}
