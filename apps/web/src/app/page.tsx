import { OrganizationJsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ComingSoonSection } from "@/components/sections/coming-soon-section";
import { DifferentialsSection } from "@/components/sections/differentials-section";
import { EcosystemSection } from "@/components/sections/ecosystem-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { ServicesSection } from "@/components/sections/services-section";

export default function Home() {
	return (
		<>
			<OrganizationJsonLd />
			<SiteHeader />
			<main id="main-content">
				<HeroSection />
				<ServicesSection />
				<PortfolioSection />
				<EcosystemSection />
				<DifferentialsSection />
				<FinalCtaSection />
				<ComingSoonSection />
			</main>
			<SiteFooter />
		</>
	);
}
