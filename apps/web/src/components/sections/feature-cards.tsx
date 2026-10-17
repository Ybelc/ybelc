// LEGADO (Ybelc-Page): não utilizado na home da Ybelc. Mantido apenas como referência.
import { Recycle, RefreshCw, Zap } from "lucide-react";
import Link from "next/link";

import { featureCards } from "@/lib/legacy/ybelc-page-content";

const iconMap = {
	refresh: RefreshCw,
	zap: Zap,
	recycle: Recycle,
} as const;

export function FeatureCards() {
	return (
		<section
			id="solucoes"
			className="relative z-20 -mt-16 mx-auto max-w-7xl px-4 pb-8 md:-mt-24 sm:px-6 lg:px-8"
			aria-labelledby="solucoes-heading"
		>
			<h2 id="solucoes-heading" className="sr-only">
				Nossas soluções
			</h2>
			<ul className="grid gap-4 md:grid-cols-3 md:gap-6">
				{featureCards.map((card) => {
					const Icon = iconMap[card.icon];
					return (
						<li key={card.title}>
							<Link
								href={card.href}
								className="group flex h-full flex-col items-center gap-4 rounded-xl bg-white px-6 py-8 text-center shadow-lg transition-shadow hover:shadow-xl focus-visible:outline-2 focus-visible:outline-econ-green focus-visible:outline-offset-2"
							>
								<div className="flex size-16 items-center justify-center rounded-full border-2 border-dashed border-econ-green/50 transition-colors group-hover:border-econ-green">
									<Icon className="size-8 text-econ-green" strokeWidth={1.75} aria-hidden="true" />
								</div>
								<h3 className="font-display font-bold text-econ-green text-sm uppercase leading-snug tracking-wide sm:text-base">
									{card.title}
								</h3>
							</Link>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
