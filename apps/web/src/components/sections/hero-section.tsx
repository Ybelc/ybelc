import { ArrowDown, ArrowUpRight } from "lucide-react";

import { ContactTrigger } from "@/components/contact/contact-trigger";
import { AreaIcon } from "@/components/visuals/area-icon";
import { EcosystemOrb } from "@/components/visuals/ecosystem-orb";
import { hero, solutions } from "@/lib/site-config";

export function HeroSection() {
	const [before, after] = hero.title.split(hero.highlight);

	return (
		<section
			id="inicio"
			className="relative -mt-[4.5rem] overflow-hidden pt-[4.5rem]"
			aria-labelledby="hero-heading"
		>
			{/* fundo */}
			<div className="y-grid y-grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
			<div
				className="pointer-events-none absolute -top-40 right-[-10%] size-[42rem] rounded-full bg-y-blue/20 blur-[120px]"
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-y-glow/40 to-transparent"
				aria-hidden="true"
			/>

			<div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 sm:pt-20 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pt-20 lg:pb-20">
				<div className="lg:col-span-7">
					<p className="y-eyebrow">{hero.eyebrow}</p>

					<h1
						id="hero-heading"
						className="mt-6 max-w-3xl text-balance font-display font-semibold text-[clamp(2.4rem,6.4vw,4.5rem)] text-white leading-[1.02] tracking-[-0.035em]"
					>
						{before}
						<span className="bg-gradient-to-r from-y-glow via-white to-y-glow bg-clip-text text-transparent">
							{hero.highlight}
						</span>
						{after}
					</h1>

					<p className="mt-6 max-w-xl text-pretty text-[1.0625rem] text-y-muted leading-relaxed sm:text-lg">
						{hero.subtitle}
					</p>

					<div className="mt-9 flex flex-col gap-3 sm:flex-row">
						<ContactTrigger className="y-btn y-btn-primary">
							{hero.primaryCta}
							<ArrowUpRight className="size-4" aria-hidden="true" />
						</ContactTrigger>
						<a href={hero.secondaryCta.href} className="y-btn y-btn-ghost">
							{hero.secondaryCta.label}
							<ArrowDown className="size-4" aria-hidden="true" />
						</a>
					</div>

					<ul className="mt-12 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-y-line bg-y-line sm:grid-cols-4">
						{solutions.items.map((s) => (
							<li key={s.id}>
								<a
									href={`#solucao-${s.id}`}
									className="flex h-full items-center gap-2.5 bg-y-navy px-3.5 py-3 text-sm text-y-muted transition-colors hover:bg-y-surface hover:text-white"
								>
									<AreaIcon area={s.id} className="size-4 shrink-0 text-y-glow" />
									<span className="leading-tight">
										{
											{
												software: "Software",
												automacao: "Automação",
												iot: "IoT",
												seguranca: "Segurança",
											}[s.id]
										}
									</span>
								</a>
							</li>
						))}
					</ul>
				</div>

				<div className="mx-auto w-full max-w-[22rem] sm:max-w-md lg:col-span-5 lg:max-w-none">
					<EcosystemOrb />
				</div>
			</div>
		</section>
	);
}
