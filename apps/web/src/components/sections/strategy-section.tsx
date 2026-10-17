import { Leaf, ShieldCheck, Sparkles, Users } from "lucide-react";

import { strategy } from "@/lib/legacy/ybelc-page-content";

const valueIconMap = {
	sparkles: Sparkles,
	leaf: Leaf,
	"shield-check": ShieldCheck,
	users: Users,
} as const;

export function StrategySection() {
	return (
		<section
			className="bg-econ-cream px-4 pt-4 pb-16 sm:px-6 sm:pt-6 sm:pb-20 lg:px-8 lg:pt-8 lg:pb-24"
			aria-labelledby="estrategia-heading"
		>
			<div className="mx-auto max-w-7xl">
				<h2
					id="estrategia-heading"
					className="text-center font-display font-extrabold text-econ-dark text-2xl uppercase tracking-wide sm:text-3xl"
				>
					{strategy.heading}
				</h2>

				<div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
					<article className="rounded-xl border-econ-green/10 border-t-4 border-t-econ-green bg-white p-6 shadow-lg sm:p-8">
						<h3 className="font-display font-bold text-econ-green text-sm uppercase tracking-wide sm:text-base">
							{strategy.mission.title}
						</h3>
						<p className="mt-4 text-econ-dark/85 text-base leading-relaxed">
							{strategy.mission.description}
						</p>
					</article>

					<article className="rounded-xl border-econ-green/10 border-t-4 border-t-econ-orange bg-white p-6 shadow-lg sm:p-8">
						<h3 className="font-display font-bold text-econ-green text-sm uppercase tracking-wide sm:text-base">
							{strategy.vision.title}
						</h3>
						<p className="mt-4 text-econ-dark/85 text-base leading-relaxed">
							{strategy.vision.description}
						</p>
					</article>
				</div>

				<h3
					id="valores-heading"
					className="mt-16 text-center font-display font-extrabold text-econ-dark text-xl uppercase tracking-wide sm:text-2xl"
				>
					{strategy.valuesHeading}
				</h3>

				<ul
					className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
					aria-labelledby="valores-heading"
				>
					{strategy.values.map((value) => {
						const Icon = valueIconMap[value.icon];
						return (
							<li key={value.title}>
								<article className="flex h-full flex-col items-center gap-4 rounded-xl bg-white px-5 py-8 text-center shadow-lg transition-shadow hover:shadow-xl">
									<div className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-econ-green/50">
										<Icon
											className="size-7 text-econ-green"
											strokeWidth={1.75}
											aria-hidden="true"
										/>
									</div>
									<div className="space-y-2">
										<h4 className="font-display font-bold text-econ-green text-sm uppercase leading-snug tracking-wide">
											{value.title}
										</h4>
										<p className="text-econ-dark/80 text-sm leading-relaxed">
											{value.description}
										</p>
									</div>
								</article>
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
}
