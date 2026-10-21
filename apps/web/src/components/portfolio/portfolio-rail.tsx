"use client";

import {
	ArrowLeft,
	ArrowRight,
	ArrowUpRight,
	Github,
	MousePointerClick,
	Play,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { PortfolioProject } from "@/lib/portfolio/schema";

import { useFinePointer, useInView, useReducedMotion } from "./hooks";
import { ProjectMedia } from "./project-media";
import { Typewriter } from "./typewriter";

const pad = (n: number) => String(n).padStart(2, "0");

type PortfolioRailProps = {
	projects: PortfolioProject[];
	onOpen: (project: PortfolioProject, origin: HTMLElement) => void;
	typedIds: ReadonlySet<string>;
	onTyped: (id: string) => void;
	/** Numeração contínua quando há mais de um trilho na página. */
	indexOffset?: number;
	total?: number;
	label?: string;
};

/**
 * Trilho de projetos com expansão fluida.
 * Desktop: painéis lado a lado; o projeto em foco cresce e os vizinhos recuam em profundidade.
 * Telas menores/toque: acordeão vertical — o primeiro toque expande, o segundo abre os detalhes.
 */
export function PortfolioRail({
	projects,
	onOpen,
	typedIds,
	onTyped,
	indexOffset = 0,
	total = projects.length,
	label = "Projetos",
}: PortfolioRailProps) {
	const fine = useFinePointer();
	const reduced = useReducedMotion();
	const stageRef = useRef<HTMLDivElement>(null);
	const railRef = useRef<HTMLUListElement>(null);
	const inView = useInView(stageRef);
	const [entered, setEntered] = useState(false);
	const [active, setActive] = useState(() =>
		Math.max(
			0,
			projects.findIndex((p) => p.is_featured),
		),
	);
	const hoverTimer = useRef<number | undefined>(undefined);
	const count = projects.length;

	useEffect(() => {
		if (inView) setEntered(true);
	}, [inView]);

	useEffect(() => {
		if (active > count - 1) setActive(0);
	}, [active, count]);

	// Largura final do painel ativo: o conteúdo usa essa medida fixa e não "re-flui" durante a expansão.
	useEffect(() => {
		const rail = railRef.current;
		if (!rail) return;
		const ro = new ResizeObserver(([entry]) => {
			rail.style.setProperty("--rail-w", `${entry.contentRect.width}px`);
		});
		ro.observe(rail);
		return () => ro.disconnect();
	}, []);

	useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

	const scheduleActivate = useCallback((i: number) => {
		window.clearTimeout(hoverTimer.current);
		hoverTimer.current = window.setTimeout(() => setActive(i), 120);
	}, []);

	const cancelHover = useCallback(
		() => window.clearTimeout(hoverTimer.current),
		[],
	);

	const focusPanel = (i: number) => {
		const next = (i + count) % count;
		setActive(next);
		railRef.current
			?.querySelectorAll<HTMLButtonElement>(".pf-hit")
			[next]?.focus({ preventScroll: true });
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
		const li = (e.target as HTMLElement).closest<HTMLElement>("[data-index]");
		if (!li) return;
		const i = Number(li.dataset.index);
		const keys: Record<string, number> = {
			ArrowRight: i + 1,
			ArrowDown: i + 1,
			ArrowLeft: i - 1,
			ArrowUp: i - 1,
			Home: 0,
			End: count - 1,
		};
		if (
			e.key in keys &&
			(e.target as HTMLElement).classList.contains("pf-hit")
		) {
			e.preventDefault();
			focusPanel(keys[e.key]);
		}
	};

	if (!count) return null;
	const current = projects[active] ?? projects[0];

	return (
		<div
			ref={stageRef}
			className="pf-stage"
			data-entered={entered ? "true" : "false"}
			style={
				{
					"--count": count,
					"--glow-x": `${((active + 0.5) / count) * 100}%`,
				} as React.CSSProperties
			}
		>
			<div className="pf-hud">
				<p className="pf-hud-label">
					<span className="pf-hud-dot" aria-hidden="true" />
					{label}
				</p>
				<p className="pf-hud-current" aria-hidden="true">
					<span className="text-y-muted">/</span> {current.category}
				</p>
				<div className="flex items-center gap-3">
					<p className="pf-hud-counter">
						<span className="sr-only">Projeto </span>
						<span className="text-white">{pad(indexOffset + active + 1)}</span>
						<span className="sr-only"> de </span>
						<span aria-hidden="true"> / </span>
						{pad(total)}
					</p>
					{count > 1 ? (
						<div className="flex gap-1.5">
							<button
								type="button"
								className="pf-nav-btn"
								onClick={() => setActive((a) => (a - 1 + count) % count)}
								aria-label="Projeto anterior"
							>
								<ArrowLeft className="size-4" aria-hidden="true" />
							</button>
							<button
								type="button"
								className="pf-nav-btn"
								onClick={() => setActive((a) => (a + 1) % count)}
								aria-label="Próximo projeto"
							>
								<ArrowRight className="size-4" aria-hidden="true" />
							</button>
						</div>
					) : null}
				</div>
			</div>

			<div className="pf-glow" aria-hidden="true" />
			<div className="pf-sweep" aria-hidden="true" />
			<ul
				ref={railRef}
				className="pf-rail"
				aria-label={label}
				onKeyDown={onKeyDown}
				onPointerLeave={cancelHover}
			>
				{projects.map((p, i) => (
					<RailPanel
						key={p.id}
						project={p}
						index={i}
						number={pad(indexOffset + i + 1)}
						active={i === active}
						distance={Math.abs(i - active)}
						fine={fine}
						reduced={reduced}
						visible={inView}
						typed={typedIds.has(p.id)}
						onTyped={onTyped}
						onActivate={setActive}
						onHoverIntent={scheduleActivate}
						onOpen={onOpen}
					/>
				))}
			</ul>

			{count > 1 ? (
				<div className="pf-scale">
					{projects.map((p, i) => (
						<button
							key={p.id}
							type="button"
							className="pf-tick"
							data-active={i === active ? "true" : "false"}
							aria-label={`Destacar ${p.title}`}
							aria-pressed={i === active}
							onClick={() => setActive(i)}
						>
							<span className="pf-tick-bar" aria-hidden="true" />
							<span className="pf-tick-label" aria-hidden="true">
								{pad(indexOffset + i + 1)}
							</span>
						</button>
					))}
				</div>
			) : null}
		</div>
	);
}

type RailPanelProps = {
	project: PortfolioProject;
	index: number;
	number: string;
	active: boolean;
	distance: number;
	fine: boolean;
	reduced: boolean;
	visible: boolean;
	typed: boolean;
	onTyped: (id: string) => void;
	onActivate: (i: number) => void;
	onHoverIntent: (i: number) => void;
	onOpen: (project: PortfolioProject, origin: HTMLElement) => void;
};

function RailPanel({
	project: p,
	index,
	number,
	active,
	distance,
	fine,
	reduced,
	visible,
	typed,
	onTyped,
	onActivate,
	onHoverIntent,
	onOpen,
}: RailPanelProps) {
	const liRef = useRef<HTMLLIElement>(null);
	const frame = useRef(0);
	const hasVideo = Boolean(p.video);
	const titleId = `pf-${p.slug}-title`;
	const summaryId = `pf-${p.slug}-summary`;

	useEffect(() => () => cancelAnimationFrame(frame.current), []);

	// Luz e parallax seguem o cursor (via variáveis CSS, sem re-render).
	const onPointerMove = (e: React.PointerEvent<HTMLLIElement>) => {
		if (!fine || reduced || e.pointerType !== "mouse") return;
		const el = liRef.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const x = (e.clientX - r.left) / r.width;
		const y = (e.clientY - r.top) / r.height;
		cancelAnimationFrame(frame.current);
		frame.current = requestAnimationFrame(() => {
			el.style.setProperty("--mx", x.toFixed(3));
			el.style.setProperty("--my", y.toFixed(3));
		});
	};

	const onPointerLeave = () => {
		cancelAnimationFrame(frame.current);
		liRef.current?.style.setProperty("--mx", "0.5");
		liRef.current?.style.setProperty("--my", "0.5");
	};

	const onClick = () => {
		// Toque: primeiro toque expande; com o projeto já aberto, mostra os detalhes.
		if (!active && !fine) {
			onActivate(index);
			return;
		}
		if (liRef.current) onOpen(p, liRef.current);
	};

	const linkTab = active ? 0 : -1;

	return (
		<li
			ref={liRef}
			className="pf-panel"
			data-index={index}
			data-slug={p.slug}
			data-active={active ? "true" : "false"}
			style={
				{ "--d": Math.min(distance, 4), "--n": index } as React.CSSProperties
			}
			onPointerEnter={(e) => {
				if (e.pointerType === "mouse") onHoverIntent(index);
			}}
			onPointerMove={onPointerMove}
			onPointerLeave={onPointerLeave}
		>
			<div className="pf-inner">
				<div className="pf-media">
					<ProjectMedia
						project={p}
						active={active}
						visible={visible}
						reducedMotion={reduced}
						priority={false}
					/>
				</div>
				<div className="pf-shade" aria-hidden="true" />
				<div className="pf-light" aria-hidden="true" />
				<span className="pf-frame" aria-hidden="true" />

				<button
					type="button"
					className="pf-hit"
					aria-labelledby={titleId}
					aria-describedby={summaryId}
					aria-expanded={active}
					aria-haspopup="dialog"
					onClick={onClick}
					onFocus={(e) => {
						// Só ativa pelo foco de teclado; no toque, o primeiro toque é tratado no onClick.
						if (e.currentTarget.matches(":focus-visible")) onActivate(index);
					}}
				/>

				<div className="pf-collapsed" aria-hidden="true">
					<span className="pf-num">{number}</span>
					<span className="pf-vtitle">{p.title}</span>
					<span className="pf-mini">
						{hasVideo ? <Play className="size-3.5" /> : null}
						{p.demo_url ? <MousePointerClick className="size-3.5" /> : null}
						{p.repository_url ? <Github className="size-3.5" /> : null}
					</span>
				</div>

				<div className="pf-content">
					<div
						className="pf-meta pf-stagger"
						style={{ "--i": 0 } as React.CSSProperties}
					>
						<span className="pf-chip">{p.category}</span>
						{p.year ? <span className="pf-year">{p.year}</span> : null}
						{p.status === "draft" ? (
							<span className="pf-chip pf-chip-draft">Rascunho</span>
						) : null}
						{hasVideo ? (
							<span className="pf-badge">
								<Play className="size-3" aria-hidden="true" /> Vídeo
							</span>
						) : null}
						{p.demo_url ? (
							<span className="pf-badge">
								<MousePointerClick className="size-3" aria-hidden="true" />{" "}
								Interativo
							</span>
						) : null}
					</div>

					<h3
						id={titleId}
						className="pf-title pf-stagger"
						style={{ "--i": 1 } as React.CSSProperties}
					>
						<span className="pf-title-num" aria-hidden="true">
							{number}
						</span>
						{p.title}
					</h3>

					{p.tagline ? (
						<div
							className="pf-stagger"
							style={{ "--i": 2 } as React.CSSProperties}
						>
							<Typewriter
								text={p.tagline}
								play={active && visible}
								complete={typed}
								onComplete={() => onTyped(p.id)}
								className="pf-tagline"
							/>
						</div>
					) : null}

					<p
						id={summaryId}
						className="pf-summary pf-stagger"
						style={{ "--i": 3 } as React.CSSProperties}
					>
						{p.short_description}
					</p>

					{p.technologies.length ? (
						<ul
							className="pf-techs pf-stagger"
							style={{ "--i": 4 } as React.CSSProperties}
							aria-label="Tecnologias"
						>
							{p.technologies.slice(0, 6).map((t) => (
								<li key={t}>{t}</li>
							))}
						</ul>
					) : null}

					<div
						className="pf-actions pf-stagger"
						style={{ "--i": 5 } as React.CSSProperties}
					>
						<span className="pf-cta" aria-hidden="true">
							{fine ? "Clique para explorar" : "Toque para explorar"}
							<ArrowUpRight className="size-4" />
						</span>
						{p.demo_url ? (
							<a
								href={p.demo_url}
								target="_blank"
								rel="noopener noreferrer"
								className="pf-link"
								tabIndex={linkTab}
								aria-label={`Abrir demonstração de ${p.title} (nova aba)`}
							>
								<MousePointerClick className="size-3.5" aria-hidden="true" />{" "}
								Demo
							</a>
						) : null}
						{p.repository_url ? (
							<a
								href={p.repository_url}
								target="_blank"
								rel="noopener noreferrer"
								className="pf-link"
								tabIndex={linkTab}
								aria-label={`Abrir repositório de ${p.title} (nova aba)`}
							>
								<Github className="size-3.5" aria-hidden="true" /> Código
							</a>
						) : null}
					</div>
				</div>
			</div>
		</li>
	);
}
