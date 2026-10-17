import { ArrowUpRight, Check } from "lucide-react";

import { ContactTrigger } from "@/components/contact/contact-trigger";
import { Reveal } from "@/components/ui/reveal";
import { AreaIcon } from "@/components/visuals/area-icon";
import { AreaMotif } from "@/components/visuals/area-motif";
import { SectionHeading } from "@/components/ui/section-heading";
import { solutions } from "@/lib/site-config";

export function ServicesSection() {
	return (
		<section
			id="solucoes"
			className="relative scroll-mt-20 py-24 lg:py-28"
			aria-labelledby="solucoes-heading"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<SectionHeading
					id="solucoes-heading"
					eyebrow={solutions.eyebrow}
					title={solutions.heading}
					description={solutions.subheading}
				/>

				<ul className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:gap-6">
					{solutions.items.map((s, i) => (
						<Reveal as="li" key={s.id} delay={(i % 2) * 90}>
							<article
								id={`solucao-${s.id}`}
								aria-labelledby={`solucao-${s.id}-title`}
								className="y-panel group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8"
							>
								<div
									className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-y-blue/0 blur-3xl transition-colors duration-500 group-hover:bg-y-blue/25"
									aria-hidden="true"
								/>

								<div className="flex items-start justify-between gap-4">
									<div className="flex items-center gap-3">
										<span className="flex size-12 items-center justify-center rounded-xl border border-y-line bg-y-blue/15 text-y-glow">
											<AreaIcon area={s.id} className="size-6" />
										</span>
										<span className="font-mono text-xs text-y-muted tracking-[0.14em]">/{s.code}</span>
									</div>
									<div className="hidden opacity-80 transition-opacity group-hover:opacity-100 sm:block">
										<AreaMotif area={s.id} />
									</div>
								</div>

								<h3
									id={`solucao-${s.id}-title`}
									className="mt-6 font-display font-semibold text-2xl text-white tracking-[-0.015em] sm:text-[1.65rem]"
								>
									{s.title}
								</h3>
								<p className="mt-3 text-y-muted leading-relaxed">{s.description}</p>

								<ul className="mt-6 grid gap-2.5">
									{s.capabilities.map((c) => (
										<li key={c} className="flex items-start gap-2.5 text-[0.9375rem] text-y-fg/90">
											<Check className="mt-1 size-4 shrink-0 text-y-glow" aria-hidden="true" />
											{c}
										</li>
									))}
								</ul>

								<div className="mt-auto pt-7">
									<p className="rounded-xl border border-y-line bg-y-ink/40 px-4 py-3 text-sm text-white">
										<span className="mr-2 font-mono text-[0.6875rem] text-y-glow uppercase tracking-[0.14em]">
											Benefício
										</span>
										{s.benefit}
									</p>
									<ContactTrigger
										interest={s.id}
										className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg font-display font-semibold text-sm text-y-glow transition-colors hover:text-white"
										aria-label={`Solicitar projeto de ${s.title}`}
									>
										Conversar sobre este projeto
										<ArrowUpRight
											className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
											aria-hidden="true"
										/>
									</ContactTrigger>
								</div>
							</article>
						</Reveal>
					))}
				</ul>
			</div>
		</section>
	);
}
