import Image from "next/image";

import { AreaIcon } from "@/components/visuals/area-icon";
import { type SolutionArea, siteConfig } from "@/lib/site-config";

const nodes: { area: SolutionArea; label: string; x: string; y: string; top?: boolean }[] = [
	{ area: "software", label: "Software", x: "18%", y: "20%", top: true },
	{ area: "automacao", label: "Automação", x: "82%", y: "20%", top: true },
	{ area: "iot", label: "IoT", x: "18%", y: "80%" },
	{ area: "seguranca", label: "Segurança", x: "82%", y: "80%" },
];

const traces = [
	"M178 178 L128 128 H72 V104",
	"M222 178 L272 128 H328 V104",
	"M178 222 L128 272 H72 V296",
	"M222 222 L272 272 H328 V296",
];

/**
 * Ilustração do ecossistema Ybelc: o núcleo (logo) conectado às quatro áreas
 * por trilhas no estilo de circuito impresso. Puramente decorativa.
 */
export function EcosystemOrb({ className = "" }: { className?: string }) {
	return (
		<div className={`relative aspect-square w-full ${className}`} aria-hidden="true">
			{/* brilho */}
			<div className="absolute inset-[18%] rounded-full bg-y-blue/25 blur-3xl" />

			<svg viewBox="0 0 400 400" className="absolute inset-0 size-full" fill="none">
				<defs>
					<linearGradient id="y-trace" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0" stopColor="#8b9bff" stopOpacity="0.9" />
						<stop offset="1" stopColor="#233dff" stopOpacity="0.9" />
					</linearGradient>
					<radialGradient id="y-core" cx="0.5" cy="0.5" r="0.5">
						<stop offset="0" stopColor="#233dff" stopOpacity="0.35" />
						<stop offset="1" stopColor="#233dff" stopOpacity="0" />
					</radialGradient>
				</defs>

				{/* perímetro de segurança */}
				<rect
					x="14"
					y="14"
					width="372"
					height="372"
					rx="36"
					stroke="#8b9bff"
					strokeOpacity="0.18"
					strokeDasharray="2 8"
				/>

				{/* órbitas */}
				<circle cx="200" cy="200" r="150" stroke="#8b9bff" strokeOpacity="0.08" />
				<circle cx="200" cy="200" r="104" stroke="#8b9bff" strokeOpacity="0.14" strokeDasharray="1 6" />
				<circle cx="200" cy="200" r="90" fill="url(#y-core)" />

				{/* ligações entre áreas */}
				<path d="M110 72 H290" stroke="#8b9bff" strokeOpacity="0.16" strokeDasharray="3 7" />
				<path d="M110 328 H290" stroke="#8b9bff" strokeOpacity="0.16" strokeDasharray="3 7" />
				<path d="M48 120 V280" stroke="#8b9bff" strokeOpacity="0.16" strokeDasharray="3 7" />
				<path d="M352 120 V280" stroke="#8b9bff" strokeOpacity="0.16" strokeDasharray="3 7" />

				{/* trilhas principais */}
				{traces.map((d) => (
					<g key={d}>
						<path d={d} stroke="#233dff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
						<path d={d} stroke="url(#y-trace)" strokeWidth="1.5" strokeLinecap="round" className="y-flow" />
					</g>
				))}

				{/* pads */}
				{[
					[178, 178],
					[222, 178],
					[178, 222],
					[222, 222],
					[128, 128],
					[272, 128],
					[128, 272],
					[272, 272],
				].map(([cx, cy]) => (
					<circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.2" fill="#050a30" stroke="#8b9bff" strokeWidth="1.2" />
				))}

				<circle cx="200" cy="200" r="66" stroke="#8b9bff" strokeOpacity="0.5" className="y-pulse" />
			</svg>

			{/* núcleo com a logo original */}
			<div className="absolute top-1/2 left-1/2 size-[28%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22%] border border-y-glow/40 bg-y-navy shadow-[0_0_60px_-10px_rgb(35_61_255/0.9)]">
				<Image
					src={siteConfig.logo.src}
					alt=""
					width={siteConfig.logo.width}
					height={siteConfig.logo.height}
					className="size-full"
					priority
				/>
			</div>

			{nodes.map((n) => (
				<div
					key={n.area}
					className={`absolute flex -translate-x-1/2 items-center gap-2 ${n.top ? "flex-col-reverse -translate-y-[calc(100%-1.5rem)] sm:-translate-y-[calc(100%-1.75rem)]" : "-translate-y-6 flex-col sm:-translate-y-7"}`}
					style={{ left: n.x, top: n.y }}
				>
					<span className="y-panel flex size-12 items-center justify-center rounded-xl text-y-glow sm:size-14">
						<AreaIcon area={n.area} className="size-5 sm:size-6" />
					</span>
					<span className="font-mono text-[0.625rem] text-y-muted uppercase tracking-[0.14em] sm:text-[0.6875rem]">
						{n.label}
					</span>
				</div>
			))}
		</div>
	);
}
