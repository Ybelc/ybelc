import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioAdmin } from "@/components/portfolio/admin/portfolio-admin";
import { listPortfolioProjects } from "@/lib/portfolio";
import { isPortfolioAdminEnabled } from "@/lib/portfolio/admin-guard";
import { readLocalProjects } from "@/lib/portfolio/local-store";
import { sortProjects } from "@/lib/portfolio/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Gerenciar portfólio",
	robots: { index: false, follow: false },
};

export default async function PortfolioAdminPage() {
	if (!isPortfolioAdminEnabled()) notFound();

	const [projects, live] = await Promise.all([
		readLocalProjects(),
		listPortfolioProjects(),
	]);

	return (
		<PortfolioAdmin
			initialProjects={sortProjects(projects)}
			liveSource={live.source}
		/>
	);
}
