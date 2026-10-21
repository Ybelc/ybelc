import { siteConfig } from "@/lib/site-config";
import localData from "../../../content/portfolio/projects.json";

import {
	type PortfolioProject,
	portfolioFileSchema,
	portfolioProjectSchema,
	sortProjects,
} from "./schema";

/**
 * Fonte de dados do Portfólio (servidor).
 *
 * PORTFOLIO_SOURCE (variável de ambiente do servidor):
 *  - "auto"  (padrão): tenta a API (`/api/v1/portfolio/projects`). Se ela não estiver
 *              disponível (offline, 404, 5xx), usa o arquivo local content/portfolio/projects.json.
 *  - "api":    usa somente a API.
 *  - "local":  usa somente o arquivo local.
 *
 * Em desenvolvimento, projetos com status "draft" do arquivo local também aparecem
 * (marcados como rascunho) para facilitar a pré-visualização pelo painel /admin/portfolio.
 */

type Source = "auto" | "api" | "local";

export type PortfolioListResult = {
	items: PortfolioProject[];
	source: "api" | "local";
};

function source(): Source {
	const v = process.env.PORTFOLIO_SOURCE?.toLowerCase();
	return v === "api" || v === "local" ? v : "auto";
}

function apiBase(): string {
	const base = siteConfig.api.replace(/\/$/, "");
	return base.endsWith("/api/v1") ? base : `${base}/api/v1`;
}

function parseList(raw: unknown): PortfolioProject[] {
	const list = Array.isArray(raw)
		? raw
		: raw &&
				typeof raw === "object" &&
				Array.isArray((raw as { items?: unknown }).items)
			? (raw as { items: unknown[] }).items
			: [];
	const out: PortfolioProject[] = [];
	for (const item of list) {
		const parsed = portfolioProjectSchema.safeParse(item);
		if (parsed.success) out.push(parsed.data);
		else if (process.env.NODE_ENV === "development") {
			console.warn(
				"[portfolio] projeto ignorado (dados inválidos):",
				parsed.error.issues[0],
			);
		}
	}
	return out;
}

async function fromApi(): Promise<PortfolioProject[] | null> {
	try {
		const res = await fetch(
			`${apiBase()}/portfolio/projects?status=published&page_size=100`,
			{
				headers: { Accept: "application/json" },
				next: { revalidate: 60, tags: ["portfolio"] },
				signal: AbortSignal.timeout(4000),
			},
		);
		if (!res.ok) return null;
		return parseList(await res.json());
	} catch {
		return null;
	}
}

async function fromLocal(): Promise<PortfolioProject[]> {
	// Em dev lê o arquivo do disco a cada requisição (alterações do painel aparecem na hora).
	if (process.env.NODE_ENV === "development") {
		const { readLocalProjects } = await import("./local-store");
		return readLocalProjects();
	}
	const parsed = portfolioFileSchema.safeParse(localData);
	return parsed.success
		? parsed.data.projects
		: parseList((localData as { projects?: unknown }).projects);
}

/** Projetos visíveis no site (publicados; em dev também rascunhos), já ordenados. */
export async function listPortfolioProjects(): Promise<PortfolioListResult> {
	const mode = source();
	const preview = process.env.NODE_ENV === "development";

	if (mode !== "local") {
		const api = await fromApi();
		if (api) {
			return {
				items: sortProjects(api.filter((p) => p.status === "published")),
				source: "api",
			};
		}
		if (mode === "api") return { items: [], source: "api" };
	}

	const local = await fromLocal();
	const visible = local.filter(
		(p) => p.status === "published" || (preview && p.status === "draft"),
	);
	return { items: sortProjects(visible), source: "local" };
}

/** Projetos para a vitrine da home: destaques primeiro; sem destaques, os primeiros da lista. */
export async function listHomePortfolioProjects(limit = 6) {
	const { items } = await listPortfolioProjects();
	const featured = items.filter((p) => p.is_featured);
	const base = featured.length >= 2 ? featured : items;
	return { items: base.slice(0, limit), total: items.length };
}

export async function hasPortfolioProjects(): Promise<boolean> {
	const { items } = await listPortfolioProjects();
	return items.length > 0;
}
