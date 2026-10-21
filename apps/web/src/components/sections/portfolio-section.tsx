import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { PortfolioShowcase } from "@/components/portfolio/portfolio-showcase";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { listHomePortfolioProjects } from "@/lib/portfolio";
import { portfolio } from "@/lib/site-config";

/** Vitrine de projetos da home. Não renderiza nada enquanto não houver projetos publicados. */
export async function PortfolioSection() {
	const { items, total } = await listHomePortfolioProjects(6);
	if (!items.length) return null;

	return (
		<section
			id="portfolio"
			className="relative scroll-mt-20 overflow-hidden py-24 lg:py-28"
			aria-labelledby="portfolio-heading"
		>
			<div
				className="y-grid y-grid-fade pointer-events-none absolute inset-0 opacity-60"
				aria-hidden="true"
			/>
			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
					<SectionHeading
						id="portfolio-heading"
						eyebrow={portfolio.eyebrow}
						title={portfolio.heading}
						description={portfolio.subheading}
					/>
					{total > items.length ? (
						<Link
							href="/portfolio"
							className="y-btn y-btn-ghost shrink-0 self-start lg:self-end"
						>
							{portfolio.allLabel}
							<span className="font-mono text-xs text-y-glow">
								{String(total).padStart(2, "0")}
							</span>
							<ArrowUpRight className="size-4" aria-hidden="true" />
						</Link>
					) : null}
				</div>

				<Reveal className="mt-12 lg:mt-14">
					<PortfolioShowcase projects={items} />
				</Reveal>
			</div>
		</section>
	);
}
