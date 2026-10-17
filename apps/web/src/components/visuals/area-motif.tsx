import type { SolutionArea } from "@/lib/site-config";

/** Pequenas ilustrações técnicas, uma por área, usadas nos cards de solução. */
export function AreaMotif({ area }: { area: SolutionArea }) {
	const common = {
		viewBox: "0 0 160 96",
		fill: "none",
		className: "h-20 w-auto",
		"aria-hidden": true,
	} as const;

	switch (area) {
		case "software":
			return (
				<svg {...common}>
					<rect x="1" y="1" width="158" height="94" rx="10" stroke="#8b9bff" strokeOpacity=".25" />
					<circle cx="13" cy="13" r="3" fill="#8b9bff" fillOpacity=".4" />
					<circle cx="24" cy="13" r="3" fill="#8b9bff" fillOpacity=".25" />
					<path d="M1 25h158" stroke="#8b9bff" strokeOpacity=".18" />
					<path d="M16 42h34M58 42h20" stroke="#233dff" strokeWidth="4" strokeLinecap="round" />
					<path d="M28 56h48M84 56h26" stroke="#8b9bff" strokeOpacity=".6" strokeWidth="4" strokeLinecap="round" />
					<path d="M28 70h22M58 70h46" stroke="#8b9bff" strokeOpacity=".35" strokeWidth="4" strokeLinecap="round" />
					<path d="M16 84h30" stroke="#233dff" strokeOpacity=".7" strokeWidth="4" strokeLinecap="round" />
					<rect x="122" y="38" width="24" height="44" rx="4" stroke="#8b9bff" strokeOpacity=".4" />
				</svg>
			);
		case "automacao":
			return (
				<svg {...common}>
					<path d="M20 50 62 16l42 34v38H20V50Z" stroke="#8b9bff" strokeOpacity=".45" strokeLinejoin="round" />
					<rect x="52" y="60" width="20" height="28" rx="2" stroke="#8b9bff" strokeOpacity=".35" />
					<circle cx="62" cy="40" r="6" fill="#233dff" />
					<circle cx="62" cy="40" r="12" stroke="#233dff" strokeOpacity=".5" className="y-pulse" />
					<path d="M104 50h22M126 50v-16M126 50v16" stroke="#8b9bff" strokeOpacity=".4" />
					<rect x="132" y="26" width="18" height="14" rx="3" stroke="#8b9bff" strokeOpacity=".5" />
					<rect x="132" y="60" width="18" height="14" rx="3" fill="#233dff" fillOpacity=".5" />
				</svg>
			);
		case "iot":
			return (
				<svg {...common}>
					<rect x="58" y="34" width="44" height="44" rx="6" stroke="#8b9bff" strokeOpacity=".5" />
					<rect x="70" y="46" width="20" height="20" rx="2" fill="#233dff" />
					{[42, 52, 62, 72].map((y) => (
						<g key={y}>
							<path d={`M50 ${y - 2}h8M102 ${y - 2}h8`} stroke="#8b9bff" strokeOpacity=".5" />
						</g>
					))}
					<path d="M64 22a22 22 0 0 1 32 0" stroke="#8b9bff" strokeOpacity=".6" strokeLinecap="round" />
					<path d="M56 14a34 34 0 0 1 48 0" stroke="#8b9bff" strokeOpacity=".35" strokeLinecap="round" />
					<circle cx="16" cy="56" r="5" stroke="#8b9bff" strokeOpacity=".5" />
					<circle cx="144" cy="56" r="5" stroke="#8b9bff" strokeOpacity=".5" />
					<path d="M21 56h29M110 56h29" stroke="#233dff" strokeWidth="1.5" className="y-flow" />
				</svg>
			);
		case "seguranca":
			return (
				<svg {...common}>
					<path
						d="M80 8 112 20v26c0 22-14 36-32 42-18-6-32-20-32-42V20L80 8Z"
						stroke="#8b9bff"
						strokeOpacity=".5"
						strokeLinejoin="round"
					/>
					<rect x="68" y="42" width="24" height="20" rx="3" fill="#233dff" />
					<path d="M73 42v-6a7 7 0 0 1 14 0v6" stroke="#8b9bff" strokeWidth="2" />
					<path d="M8 30h28M8 48h28M8 66h28M124 30h28M124 48h28M124 66h28" stroke="#8b9bff" strokeOpacity=".2" />
					<circle cx="36" cy="48" r="3" fill="#8b9bff" fillOpacity=".6" />
					<circle cx="124" cy="48" r="3" fill="#8b9bff" fillOpacity=".6" />
				</svg>
			);
	}
}
