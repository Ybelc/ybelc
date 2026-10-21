import { Logo } from "@/components/brand/logo";
import { HeaderShell } from "@/components/layout/header-shell";
import { hasPublishedPosts } from "@/lib/blog";
import { hasPortfolioProjects } from "@/lib/portfolio";
import { getNavLinks } from "@/lib/site-config";

export async function SiteHeader() {
	const [showBlog, showPortfolio] = await Promise.all([hasPublishedPosts(), hasPortfolioProjects()]);
	const links = getNavLinks(showBlog, showPortfolio);

	return <HeaderShell links={links} logo={<Logo href="/#inicio" priority />} />;
}
