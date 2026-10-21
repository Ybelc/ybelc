import { Code2, Cpu, House, ShieldCheck, Sparkles } from "lucide-react";

import type { PortfolioArea } from "@/lib/portfolio/schema";

const icons = {
	software: Code2,
	automacao: House,
	iot: Cpu,
	seguranca: ShieldCheck,
} as const;

function hash(input: string) {
	let h = 2166136261;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

function rng(seed: number) {
	let s = seed || 1;
	return () => {
		s ^= s << 13;
		s ^= s >>> 17;
		s ^= s << 5;
		return ((s >>> 0) % 10000) / 10000;
	};
}

function initials(title: string) {
	const words = title
		.split(/\s+/)
		.filter((w) => w.length > 2 || /^[A-Z0-9]/.test(w));
	return (
		(words[0]?.[0] ?? "Y").toUpperCase() + (words[1]?.[0] ?? "").toUpperCase()
	);
}

/**
 * Visual generativo exibido quando o projeto não tem imagem nem vídeo.
 * Determinístico (baseado no slug): o mesmo projeto sempre recebe o mesmo desenho.
 */
export function MediaFallback({
	seed,
	title,
	area,
}: {
	seed: string;
	title: string;
	area: PortfolioArea | null;
}) {
	const rand = rng(hash(seed));
	const Icon = area ? icons[area] : Sparkles;

	// Trilhas de "circuito" ortogonais
	const traces = Array.from({ length: 14 }, (_, i) => {
		let x = Math.round(rand() * 20) * 40;
		let y = Math.round(rand() * 25) * 40;
		let d = `M${x} ${y}`;
		for (let s = 0; s < 4; s++) {
			if ((s + i) % 2)
				x += (rand() > 0.5 ? 1 : -1) * Math.round(1 + rand() * 4) * 40;
			else y += (rand() > 0.5 ? 1 : -1) * Math.round(1 + rand() * 4) * 40;
			d += ` L${x} ${y}`;
		}
		return { d, x, y, strong: i % 4 === 0 };
	});
	const hue = Math.round(rand() * 40) - 20;

	return (
		<div
			className="pf-fallback"
			style={{ "--pf-hue": `${hue}deg` } as React.CSSProperties}
			aria-hidden="true"
		>
			<div className="pf-fallback-glow" />
			<svg
				className="absolute inset-0 size-full"
				viewBox="0 0 800 1000"
				preserveAspectRatio="xMidYMid slice"
				fill="none"
			>
				<title>{title}</title>
				{traces.map((t) => (
					<g key={t.d}>
						<path
							d={t.d}
							stroke={t.strong ? "#233dff" : "#8b9bff"}
							strokeOpacity={t.strong ? 0.75 : 0.22}
							strokeWidth={t.strong ? 2 : 1.25}
							className={t.strong ? "y-flow" : undefined}
						/>
						<circle
							cx={t.x}
							cy={t.y}
							r={t.strong ? 5 : 3}
							fill={t.strong ? "#8b9bff" : "#233dff"}
						/>
					</g>
				))}
			</svg>
			<div className="pf-fallback-mark">
				<span className="pf-fallback-initials">{initials(title)}</span>
				<span className="pf-fallback-icon">
					<Icon className="size-7" strokeWidth={1.5} />
				</span>
			</div>
		</div>
	);
}
