"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
	as?: "div" | "li" | "section" | "article";
	delay?: number;
	className?: string;
	children: React.ReactNode;
};

/**
 * Revela o conteúdo suavemente quando entra na viewport.
 * Sem JS (ou com movimento reduzido) o conteúdo permanece visível.
 */
export function Reveal({ as: Tag = "div", delay = 0, className = "", children }: RevealProps) {
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			el.dataset.visible = "true";
			return;
		}
		el.dataset.visible = "false";
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						(entry.target as HTMLElement).dataset.visible = "true";
						observer.unobserve(entry.target);
					}
				}
			},
			{ rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<Tag
			// biome-ignore lint/suspicious/noExplicitAny: ref polimórfico
			ref={ref as any}
			className={`y-reveal ${className}`}
			data-visible="true"
			style={delay ? { transitionDelay: `${delay}ms` } : undefined}
		>
			{children}
		</Tag>
	);
}
