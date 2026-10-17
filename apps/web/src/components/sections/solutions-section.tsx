import { AlertCircle, Recycle, RefreshCw, Zap } from "lucide-react";

import { solutions } from "@/lib/legacy/ybelc-page-content";
import { siteConfig } from "@/lib/site-config";
import { MobileNav } from "../layout/mobile-nav";
import { SolutionContactCta } from "./solution-contact-cta";

const iconMap = {
	refresh: RefreshCw,
	zap: Zap,
	recycle: Recycle,
} as const;

const accentBorderClass = {
	green: "border-t-econ-green",
	orange: "border-t-econ-orange",
} as const;

export function SolutionsSection() {
	return (
		<section
			className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
			aria-labelledby="solucoes-detalhes-heading"
		>
			<div className="mx-auto max-w-7xl">
				<div className="mx-auto max-w-3xl text-center">
					<h2
						id="solucoes-detalhes-heading"
						className="font-display font-extrabold text-econ-dark text-2xl uppercase tracking-wide sm:text-3xl"
					>
						{solutions.heading}
					</h2>
					<p className="mt-4 text-econ-dark/80 text-base leading-relaxed sm:text-lg">
						{solutions.subheading}
					</p>
				</div>

				<ul className="mt-14 space-y-10 lg:space-y-14">
					{solutions.items.map((solution) => {
						const Icon = iconMap[solution.icon];
						const borderClass = accentBorderClass[solution.accent];

						return (
							<li key={solution.id}>
								<article
									id={`solucao-${solution.id}`}
									className={`scroll-mt-28 rounded-xl border-econ-green/10 border-t-4 ${borderClass} bg-econ-cream p-6 shadow-lg sm:p-8 lg:p-10`}
								>
									<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
										<div className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-econ-green/50 bg-white">
											<Icon
												className="size-8 text-econ-green"
												strokeWidth={1.75}
												aria-hidden="true"
											/>
										</div>

										<div className="min-w-0 flex-1 space-y-5">
											<header>
												<p className="font-display font-bold text-econ-green text-xs uppercase tracking-widest sm:text-sm">
													{solution.shortTitle}
												</p>
												<h3 className="mt-2 font-display font-extrabold text-econ-dark text-xl uppercase tracking-wide sm:text-2xl">
													{solution.title}
												</h3>
											</header>

											<div className="space-y-4 text-econ-dark/85 text-base leading-relaxed">
												{solution.paragraphs.map((paragraph, index) => (
													<p key={index}>{paragraph}</p>
												))}
											</div>

											{"modules" in solution && solution.modules ? (
												<div>
													<h4 className="font-display font-bold text-econ-green text-sm uppercase tracking-wide">
														Principais módulos
													</h4>
													<ul className="mt-3 flex flex-wrap gap-2">
														{solution.modules.map((module) => (
															<li
																key={module}
																className="rounded-full border border-econ-green/25 bg-white px-4 py-1.5 font-display font-semibold text-econ-dark text-xs uppercase tracking-wide"
															>
																{module}
															</li>
														))}
													</ul>
												</div>
											) : null}

											{"dimensions" in solution && solution.dimensions ? (
												<div>
													<h4 className="font-display font-bold text-econ-green text-sm uppercase tracking-wide">
														Dimensões avaliadas
													</h4>
													<ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
														{solution.dimensions.map((dimension) => (
															<li
																key={dimension}
																className="rounded-lg bg-white px-4 py-3 text-center shadow-sm"
															>
																<span className="font-display font-semibold text-econ-dark text-xs uppercase leading-snug tracking-wide sm:text-sm">
																	{dimension}
																</span>
															</li>
														))}
													</ul>
												</div>
											) : null}

											{"problems" in solution && solution.problems ? (
												<div>
													<h4 className="font-display font-bold text-econ-green text-sm uppercase tracking-wide">
														Problemas que ataca
													</h4>
													<ul className="mt-3 space-y-2">
														{solution.problems.map((problem) => (
															<li
																key={problem}
																className="flex items-start gap-3 text-econ-dark/85 text-sm leading-relaxed sm:text-base"
															>
																<AlertCircle
																	className="mt-0.5 size-4 shrink-0 text-econ-orange"
																	aria-hidden="true"
																/>
																{problem}
															</li>
														))}
													</ul>
												</div>
											) : null}

											{"closing" in solution && solution.closing ? (
												<p className="border-econ-green/15 border-t pt-5 font-medium text-econ-dark text-base leading-relaxed">
													{solution.closing}
												</p>
											) : null}
											{solution.id === "plataforma" ? (
												<div className="flex items-center gap-2">
													<a
														href={siteConfig.accessUrl}
														target={siteConfig.accessUrl.startsWith("http") ? "_blank" : undefined}
														rel={
															siteConfig.accessUrl.startsWith("http")
																? "noopener noreferrer"
																: undefined
														}
														className="hidden min-h-11 items-center rounded-full border-2 border-econ-orange px-5 font-display font-semibold text-econ-orange text-sm tracking-wide transition-colors hover:bg-econ-orange hover:text-white lg:inline-flex"
													>
														Acessar 
													</a>
													<MobileNav accessHref={siteConfig.accessUrl} />
												</div>
											) : null}
											{solution.id === "dmc" ? (
												<div className="pt-1">
													<SolutionContactCta
														interest="dmc"
														buttonLabel="Solicitar mais informações"
														dialogTitle="Solicitar mais informações"
														dialogDescription="Preencha os dados abaixo para receber mais informações sobre o DMC."
													/>
												</div>
											) : null}
											{solution.id === "mri" ? (
												<div className="pt-1">
													<SolutionContactCta
														interest="mri"
														buttonLabel="Solicite a visita de um Agente de Circularidade"
														dialogTitle="Solicitar visita"
														dialogDescription="Preencha os dados abaixo para solicitar a visita de um Agente de Circularidade."
														requireAddress
													/>
												</div>
											) : null}
										</div>
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
