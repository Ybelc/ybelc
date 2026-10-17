import { Cloud, LayoutDashboard, Radio, ShieldCheck, Thermometer } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ecosystem } from "@/lib/site-config";

const layerIcons = {
	dispositivos: Thermometer,
	conectividade: Radio,
	software: Cloud,
	controle: LayoutDashboard,
} as const;

export function EcosystemSection() {
	return (
		<section
			id="ecossistema"
			className="relative scroll-mt-20 overflow-hidden border-y-line border-y bg-y-ink py-24 lg:py-32"
			aria-labelledby="ecossistema-heading"
		>
			<div className="y-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent)]" aria-hidden="true" />

			<div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:px-8 lg:grid-cols-12 lg:gap-12">
				<div className="lg:col-span-5">
					<SectionHeading
						id="ecossistema-heading"
						eyebrow={ecosystem.eyebrow}
						title={ecosystem.heading}
						description={ecosystem.subheading}
					/>

					<Reveal className="mt-10">
						<figure className="y-panel rounded-2xl p-6">
							<figcaption>
								<p className="font-display font-semibold text-white">{ecosystem.exampleTitle}</p>
								<p className="mt-1 text-sm text-y-muted">{ecosystem.exampleNote}</p>
							</figcaption>
							<ol className="relative mt-5 space-y-4 border-y-line border-l pl-6">
								{ecosystem.example.map((step, i) => (
									<li key={step} className="relative text-[0.9375rem] text-y-fg/90 leading-relaxed">
										<span
											className="absolute top-0.5 -left-[2.1rem] flex size-5 items-center justify-center rounded-full border border-y-glow/50 bg-y-ink font-mono text-[0.625rem] text-y-glow"
											aria-hidden="true"
										>
											{i + 1}
										</span>
										{step}
									</li>
								))}
							</ol>
						</figure>
					</Reveal>
				</div>

				<div className="lg:col-span-7">
					<Reveal>
						<div className="relative rounded-[1.75rem] border border-y-glow/25 border-dashed p-3 sm:p-5">
							<div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full border border-y-line bg-y-ink px-3 py-1 font-mono text-[0.6875rem] text-y-glow uppercase tracking-[0.12em]">
								<ShieldCheck className="size-3.5" aria-hidden="true" />
								Camada de segurança
							</div>

							<ol className="relative mt-3" aria-label="Camadas do ecossistema">
								{ecosystem.layers.map((layer, i) => {
									const Icon = layerIcons[layer.id];
									const last = i === ecosystem.layers.length - 1;
									return (
										<li key={layer.id} className="relative">
											<div className="y-panel flex items-start gap-4 rounded-2xl p-5 sm:items-center sm:p-6">
												<span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-y-blue/15 text-y-glow ring-1 ring-y-line">
													<Icon className="size-6" strokeWidth={1.6} aria-hidden="true" />
												</span>
												<div className="min-w-0 flex-1">
													<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
														<span className="font-mono text-[0.6875rem] text-y-muted tracking-[0.14em]">
															L{i + 1}
														</span>
														<h3 className="font-display font-semibold text-lg text-white">{layer.label}</h3>
													</div>
													<p className="mt-1.5 text-sm text-y-muted leading-relaxed">{layer.detail}</p>
												</div>
											</div>
											{!last ? (
												<svg
													className="mx-auto block h-8 w-6"
													viewBox="0 0 24 32"
													fill="none"
													aria-hidden="true"
												>
													<path d="M12 0v32" stroke="#233dff" strokeOpacity=".35" strokeWidth="3" />
													<path d="M12 0v32" stroke="#8b9bff" strokeWidth="1.5" className="y-flow" />
												</svg>
											) : null}
										</li>
									);
								})}
							</ol>

							<p className="mt-5 flex items-start gap-2.5 rounded-xl bg-y-blue/10 px-4 py-3 text-sm text-y-fg/90 leading-relaxed">
								<ShieldCheck className="mt-0.5 size-4 shrink-0 text-y-glow" aria-hidden="true" />
								{ecosystem.security}
							</p>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
