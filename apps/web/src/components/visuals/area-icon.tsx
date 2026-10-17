import { Code2, Cpu, House, ShieldCheck } from "lucide-react";

import type { SolutionArea } from "@/lib/site-config";

export const areaIcons = {
	software: Code2,
	automacao: House,
	iot: Cpu,
	seguranca: ShieldCheck,
} as const satisfies Record<SolutionArea, unknown>;

export function AreaIcon({ area, className }: { area: SolutionArea; className?: string }) {
	const Icon = areaIcons[area];
	return <Icon className={className} strokeWidth={1.6} aria-hidden="true" />;
}
