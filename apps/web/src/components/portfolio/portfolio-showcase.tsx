"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { PortfolioProject } from "@/lib/portfolio/schema";

import { PortfolioRail } from "./portfolio-rail";
import { ProjectDialog } from "./project-dialog";

type PortfolioShowcaseProps = {
	projects: PortfolioProject[];
	/** "home": um único trilho. "full": filtro por categoria e trilhos de até `perRail` projetos. */
	variant?: "home" | "full";
	perRail?: number;
};

const HASH_PREFIX = "#projeto-";

function chunk<T>(items: T[], size: number): T[][] {
	const out: T[][] = [];
	for (let i = 0; i < items.length; i += size)
		out.push(items.slice(i, i + size));
	// Evita um último trilho com um único projeto.
	if (out.length > 1 && out[out.length - 1].length === 1) {
		const last = out.pop() as T[];
		out[out.length - 1].push(...last);
	}
	return out;
}

export function PortfolioShowcase({
	projects,
	variant = "home",
	perRail = 5,
}: PortfolioShowcaseProps) {
	const [category, setCategory] = useState<string | null>(null);
	const [openId, setOpenId] = useState<string | null>(null);
	const [origin, setOrigin] = useState<HTMLElement | null>(null);
	const [typedIds, setTypedIds] = useState<Set<string>>(() => new Set());

	const categories = useMemo(() => {
		const counts = new Map<string, number>();
		for (const p of projects)
			counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
		return [...counts.entries()];
	}, [projects]);

	const filtered = useMemo(
		() =>
			category ? projects.filter((p) => p.category === category) : projects,
		[projects, category],
	);
	const rails = useMemo(
		() => (variant === "full" ? chunk(filtered, perRail) : [filtered]),
		[filtered, variant, perRail],
	);

	const openIndex = openId ? filtered.findIndex((p) => p.id === openId) : -1;
	const openProject = openIndex >= 0 ? filtered[openIndex] : null;

	const onTyped = useCallback((id: string) => {
		setTypedIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
	}, []);

	const open = useCallback((p: PortfolioProject, el: HTMLElement) => {
		setOrigin(el);
		setOpenId(p.id);
		history.replaceState(null, "", `${HASH_PREFIX}${p.slug}`);
	}, []);

	const close = useCallback(() => {
		setOpenId(null);
		if (location.hash.startsWith(HASH_PREFIX)) {
			history.replaceState(null, "", location.pathname + location.search);
		}
	}, []);

	const step = (dir: number) => {
		if (openIndex < 0) return;
		const next =
			filtered[(openIndex + dir + filtered.length) % filtered.length];
		setOpenId(next.id);
		setOrigin(
			document.querySelector<HTMLElement>(`[data-slug="${next.slug}"]`),
		);
		history.replaceState(null, "", `${HASH_PREFIX}${next.slug}`);
	};

	// Link direto: /#projeto-<slug> ou /portfolio#projeto-<slug>
	useEffect(() => {
		const fromHash = () => {
			if (!location.hash.startsWith(HASH_PREFIX)) return;
			const slug = decodeURIComponent(location.hash.slice(HASH_PREFIX.length));
			const p = projects.find((x) => x.slug === slug);
			if (!p) return;
			const el = document.querySelector<HTMLElement>(`[data-slug="${slug}"]`);
			el?.scrollIntoView({ block: "center" });
			setOrigin(el);
			setOpenId(p.id);
		};
		fromHash();
		window.addEventListener("hashchange", fromHash);
		return () => window.removeEventListener("hashchange", fromHash);
	}, [projects]);

	const starts = rails.map((_, i) =>
		rails.slice(0, i).reduce((n, g) => n + g.length, 0),
	);

	return (
		<div className="pf-showcase">
			{variant === "full" && categories.length > 1 ? (
				<fieldset className="pf-filters">
					<legend className="sr-only">Filtrar projetos por categoria</legend>
					<button
						type="button"
						className="pf-filter"
						aria-pressed={category === null}
						onClick={() => setCategory(null)}
					>
						Todos <span className="pf-filter-count">{projects.length}</span>
					</button>
					{categories.map(([c, n]) => (
						<button
							key={c}
							type="button"
							className="pf-filter"
							aria-pressed={category === c}
							onClick={() => setCategory(c)}
						>
							{c} <span className="pf-filter-count">{n}</span>
						</button>
					))}
				</fieldset>
			) : null}

			<div className="grid gap-10 lg:gap-14">
				{rails.map((group, i) => {
					const start = starts[i];
					return (
						<PortfolioRail
							key={`${category ?? "all"}-${group[0]?.id ?? i}`}
							projects={group}
							onOpen={open}
							typedIds={typedIds}
							onTyped={onTyped}
							indexOffset={start}
							total={filtered.length}
							label={
								rails.length > 1
									? `LAB://projetos — módulo ${String(i + 1).padStart(2, "0")}`
									: "LAB://projetos"
							}
						/>
					);
				})}
			</div>

			<ProjectDialog
				project={openProject}
				origin={origin}
				onClose={close}
				onPrev={filtered.length > 1 ? () => step(-1) : undefined}
				onNext={filtered.length > 1 ? () => step(1) : undefined}
				typed={openProject ? typedIds.has(openProject.id) : false}
				onTyped={onTyped}
			/>
		</div>
	);
}
