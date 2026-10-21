import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbJsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PortfolioShowcase } from "@/components/portfolio/portfolio-showcase";
import { listPortfolioProjects } from "@/lib/portfolio";
import { portfolio, siteConfig } from "@/lib/site-config";

export const revalidate = 60;

export const metadata: Metadata = {
	title: "Portfólio",
	description: portfolio.subheading,
	alternates: { canonical: "/portfolio" },
	openGraph: {
		title: "Portfólio | Ybelc",
		description: portfolio.subheading,
		url: `${siteConfig.url}/portfolio`,
		type: "website",
	},
};

export default async function PortfolioPage() {
	const { items } = await listPortfolioProjects();
	if (!items.length) notFound();

	return (
		<>
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", href: "/" },
					{ name: "Portfólio", href: "/portfolio" },
				]}
			/>
			<SiteHeader />
			<main
				id="main-content"
				className="relative min-h-[70vh] overflow-hidden bg-y-navy"
			>
				<div
					className="y-grid y-grid-fade pointer-events-none absolute inset-x-0 top-0 h-[40rem] opacity-70"
					aria-hidden="true"
				/>
				<section className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8 lg:pt-20">
					<p className="y-eyebrow">{portfolio.eyebrow}</p>
					<h1 className="mt-5 max-w-4xl text-balance font-display font-semibold text-[clamp(2.25rem,5vw,3.75rem)] text-white leading-[1.04] tracking-[-0.035em]">
						{portfolio.heading}
					</h1>
					<p className="mt-5 max-w-2xl text-pretty text-lg text-y-muted leading-relaxed">
						{portfolio.subheading}
					</p>

					<div className="mt-12">
						<PortfolioShowcase projects={items} variant="full" />
					</div>
				</section>
			</main>
			<SiteFooter />
		</>
	);
}
