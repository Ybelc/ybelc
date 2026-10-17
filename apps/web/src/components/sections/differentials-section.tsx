import { Gauge, Network, Puzzle, Scale, ShieldCheck, Target } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { differentials } from "@/lib/site-config";

const icons = {
	target: Target,
	puzzle: Puzzle,
	network: Network,
	scale: Scale,
	shield: ShieldCheck,
	gauge: Gauge,
} as const;

export function DifferentialsSection() {
	return (
		<section
			id="diferenciais"
			className="relative scroll-mt-20 py-24 lg:py-32"
			aria-labelledby="diferenciais-heading"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid gap-10 lg:grid-cols-12 lg:items-end">
					<div className="lg:col-span-8">
						<SectionHeading
							id="diferenciais-heading"
							eyebrow={differentials.eyebrow}
							title={differentials.heading}
						/>
					</div>
					<p className="text-pretty text-lg text-y-muted leading-relaxed lg:col-span-4">
						{differentials.subheading}
					</p>
				</div>

				<ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-y-line bg-y-line sm:grid-cols-2 lg:grid-cols-3">
					{differentials.items.map((item, i) => {
						const Icon = icons[item.icon];
						return (
							<Reveal as="li" key={item.title} delay={(i % 3) * 80} className="bg-y-navy">
								<div className="group relative h-full p-7 transition-colors duration-300 hover:bg-y-surface sm:p-8">
									<div className="flex items-center justify-between">
										<Icon
											className="size-7 text-y-glow transition-transform duration-300 group-hover:scale-110"
											strokeWidth={1.5}
											aria-hidden="true"
										/>
										<span className="font-mono text-xs text-y-muted/70">{String(i + 1).padStart(2, "0")}</span>
									</div>
									<h3 className="mt-8 font-display font-semibold text-white text-xl tracking-[-0.01em]">
										{item.title}
									</h3>
									<p className="mt-2.5 text-[0.9375rem] text-y-muted leading-relaxed">{item.description}</p>
									<span
										className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-y-blue to-y-glow transition-transform duration-500 group-hover:scale-x-100"
										aria-hidden="true"
									/>
								</div>
							</Reveal>
						);
					})}
				</ul>
			</div>
		</section>
	);
}
