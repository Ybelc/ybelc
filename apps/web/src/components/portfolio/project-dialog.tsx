"use client";

import {
	ArrowLeft,
	ArrowRight,
	ArrowUpRight,
	ChevronLeft,
	ChevronRight,
	ExternalLink,
	Github,
	ImageIcon,
	MousePointerClick,
	Play,
	X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ContactTrigger } from "@/components/contact/contact-trigger";
import {
	embedSrc,
	embedThumbnail,
	isRemoteSrc,
	type PortfolioImage,
	type PortfolioProject,
} from "@/lib/portfolio/schema";

import { useReducedMotion } from "./hooks";
import { MediaFallback } from "./media-fallback";
import { Typewriter } from "./typewriter";

type Slide =
	| { kind: "video-file"; src: string; poster: string | null }
	| { kind: "video-embed"; url: string }
	| { kind: "image"; image: PortfolioImage };

function buildSlides(p: PortfolioProject): Slide[] {
	const slides: Slide[] = [];
	if (p.video?.kind === "file")
		slides.push({
			kind: "video-file",
			src: p.video.src,
			poster: p.video.poster ?? p.cover_image?.src ?? null,
		});
	if (p.video?.kind === "embed")
		slides.push({ kind: "video-embed", url: p.video.url });
	const seen = new Set<string>();
	for (const img of [p.cover_image, ...p.gallery]) {
		if (img && !seen.has(img.src)) {
			seen.add(img.src);
			slides.push({ kind: "image", image: img });
		}
	}
	return slides;
}

type ProjectDialogProps = {
	project: PortfolioProject | null;
	origin: HTMLElement | null;
	onClose: () => void;
	onPrev?: () => void;
	onNext?: () => void;
	typed: boolean;
	onTyped: (id: string) => void;
};

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

/**
 * Detalhes do projeto em um <dialog> nativo (foco preso, Esc fecha).
 * A abertura "nasce" do painel clicado: o recorte (clip-path) parte do retângulo de origem.
 */
export function ProjectDialog({
	project,
	origin,
	onClose,
	onPrev,
	onNext,
	typed,
	onTyped,
}: ProjectDialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const reduced = useReducedMotion();
	const closingRef = useRef(false);
	const originRef = useRef<HTMLElement | null>(origin);

	useEffect(() => {
		originRef.current = origin;
	}, [origin]);

	const clipFromOrigin = useCallback(() => {
		const dlg = dialogRef.current;
		const o = originRef.current;
		if (!dlg || !o?.isConnected) return null;
		const a = o.getBoundingClientRect();
		const b = dlg.getBoundingClientRect();
		const t = Math.max(0, a.top - b.top);
		const l = Math.max(0, a.left - b.left);
		const r = Math.max(0, b.right - a.right);
		const btm = Math.max(0, b.bottom - a.bottom);
		if (t + btm >= b.height || l + r >= b.width) return null;
		return `inset(${t}px ${r}px ${btm}px ${l}px round 20px)`;
	}, []);

	// Abre / fecha conforme o projeto selecionado.
	useEffect(() => {
		const dlg = dialogRef.current;
		if (!dlg) return;
		if (project && !dlg.open) {
			closingRef.current = false;
			dlg.showModal();
			dlg.scrollTop = 0;
			document.documentElement.classList.add("pf-scroll-lock");
			const from = reduced ? null : clipFromOrigin();
			if (from) {
				dlg.animate(
					[
						{ clipPath: from, opacity: 0.4 },
						{ clipPath: "inset(0px 0px 0px 0px round 28px)", opacity: 1 },
					],
					{ duration: 720, easing: EASE },
				);
			} else if (!reduced) {
				dlg.animate(
					[
						{ opacity: 0, transform: "translateY(16px) scale(0.98)" },
						{ opacity: 1, transform: "none" },
					],
					{ duration: 380, easing: EASE },
				);
			}
		} else if (!project && dlg.open) {
			dlg.close();
		}
	}, [project, reduced, clipFromOrigin]);

	useEffect(
		() => () => document.documentElement.classList.remove("pf-scroll-lock"),
		[],
	);

	const requestClose = useCallback(() => {
		const dlg = dialogRef.current;
		if (!dlg || closingRef.current) return;
		closingRef.current = true;
		const to = reduced ? null : clipFromOrigin();
		const anim = reduced
			? null
			: dlg.animate(
					to
						? [
								{ clipPath: "inset(0px 0px 0px 0px round 28px)", opacity: 1 },
								{ clipPath: to, opacity: 0 },
							]
						: [
								{ opacity: 1, transform: "none" },
								{ opacity: 0, transform: "translateY(12px) scale(0.985)" },
							],
					{ duration: to ? 460 : 240, easing: EASE, fill: "forwards" },
				);
		const finish = () => {
			dlg.close();
			anim?.cancel();
		};
		if (anim) anim.onfinish = finish;
		else finish();
	}, [reduced, clipFromOrigin]);

	const handleNativeClose = () => {
		document.documentElement.classList.remove("pf-scroll-lock");
		closingRef.current = false;
		onClose();
		originRef.current
			?.querySelector<HTMLElement>(".pf-hit")
			?.focus({ preventScroll: true });
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
		const tag = (e.target as HTMLElement).tagName;
		if (tag === "INPUT" || tag === "TEXTAREA" || tag === "IFRAME") return;
		if (e.key === "PageDown" && onNext) {
			e.preventDefault();
			onNext();
		}
		if (e.key === "PageUp" && onPrev) {
			e.preventDefault();
			onPrev();
		}
	};

	return (
		<dialog
			ref={dialogRef}
			className="pf-dialog"
			aria-labelledby="pf-dialog-title"
			aria-describedby="pf-dialog-summary"
			onCancel={(e) => {
				e.preventDefault();
				requestClose();
			}}
			onClose={handleNativeClose}
			onClick={(e) => {
				if (e.target === dialogRef.current) requestClose();
			}}
			onKeyDown={onKeyDown}
		>
			{project ? (
				<DialogBody
					key={project.id}
					project={project}
					onClose={requestClose}
					onPrev={onPrev}
					onNext={onNext}
					typed={typed}
					onTyped={onTyped}
				/>
			) : null}
		</dialog>
	);
}

function DialogBody({
	project: p,
	onClose,
	onPrev,
	onNext,
	typed,
	onTyped,
}: {
	project: PortfolioProject;
	onClose: () => void;
	onPrev?: () => void;
	onNext?: () => void;
	typed: boolean;
	onTyped: (id: string) => void;
}) {
	const paragraphs = useMemo(
		() =>
			(p.full_description || p.short_description)
				.split(/\n{2,}/)
				.map((t) => t.trim())
				.filter(Boolean),
		[p.full_description, p.short_description],
	);

	const isGithub = p.repository_url
		? /github\.com/i.test(p.repository_url)
		: false;

	return (
		<div className="pf-dialog-body">
			<div className="pf-dialog-bar">
				<p className="pf-hud-label">
					<span className="pf-hud-dot" aria-hidden="true" />
					Projeto · {p.category}
				</p>
				<div className="flex items-center gap-1.5">
					{onPrev ? (
						<button
							type="button"
							className="pf-nav-btn"
							onClick={onPrev}
							aria-label="Projeto anterior"
						>
							<ArrowLeft className="size-4" aria-hidden="true" />
						</button>
					) : null}
					{onNext ? (
						<button
							type="button"
							className="pf-nav-btn"
							onClick={onNext}
							aria-label="Próximo projeto"
						>
							<ArrowRight className="size-4" aria-hidden="true" />
						</button>
					) : null}
					<button
						type="button"
						className="pf-nav-btn ml-1.5"
						onClick={onClose}
						aria-label="Fechar detalhes do projeto"
					>
						<X className="size-4" aria-hidden="true" />
					</button>
				</div>
			</div>

			<div className="pf-dialog-grid">
				<MediaStage project={p} />

				<div className="pf-dialog-info">
					<div
						className="pf-reveal-in"
						style={{ "--i": 0 } as React.CSSProperties}
					>
						<div className="flex flex-wrap items-center gap-2">
							<span className="pf-chip">{p.category}</span>
							{p.year ? <span className="pf-year">{p.year}</span> : null}
							{p.status === "draft" ? (
								<span className="pf-chip pf-chip-draft">Rascunho</span>
							) : null}
						</div>
						<h2
							id="pf-dialog-title"
							className="mt-4 font-display font-semibold text-3xl text-white leading-tight tracking-[-0.025em] sm:text-4xl"
						>
							{p.title}
						</h2>
						{p.tagline ? (
							<Typewriter
								text={p.tagline}
								play
								complete={typed}
								onComplete={() => onTyped(p.id)}
								className="pf-tagline mt-3"
								startDelay={520}
							/>
						) : null}
					</div>

					<div
						id="pf-dialog-summary"
						className="pf-reveal-in mt-6 space-y-4 text-y-muted leading-relaxed"
						style={{ "--i": 1 } as React.CSSProperties}
					>
						{paragraphs.map((t) => (
							<p key={t}>{t}</p>
						))}
					</div>

					{p.technologies.length ? (
						<div
							className="pf-reveal-in mt-7"
							style={{ "--i": 2 } as React.CSSProperties}
						>
							<h3 className="font-mono text-[0.6875rem] text-y-glow uppercase tracking-[0.16em]">
								Tecnologias
							</h3>
							<ul className="pf-techs mt-3">
								{p.technologies.map((t) => (
									<li key={t}>{t}</li>
								))}
							</ul>
						</div>
					) : null}

					<div
						className="pf-reveal-in mt-8 flex flex-wrap gap-3"
						style={{ "--i": 3 } as React.CSSProperties}
					>
						{p.project_url ? (
							<a
								href={p.project_url}
								target="_blank"
								rel="noopener noreferrer"
								className="y-btn y-btn-primary"
							>
								Visitar projeto{" "}
								<ExternalLink className="size-4" aria-hidden="true" />
							</a>
						) : null}
						{p.demo_url ? (
							<a
								href={p.demo_url}
								target="_blank"
								rel="noopener noreferrer"
								className={`y-btn ${p.project_url ? "y-btn-ghost" : "y-btn-primary"}`}
							>
								<MousePointerClick className="size-4" aria-hidden="true" />{" "}
								Abrir demonstração
							</a>
						) : null}
						{p.repository_url ? (
							<a
								href={p.repository_url}
								target="_blank"
								rel="noopener noreferrer"
								className="y-btn y-btn-ghost"
							>
								<Github className="size-4" aria-hidden="true" />{" "}
								{isGithub ? "Ver no GitHub" : "Repositório"}
							</a>
						) : null}
					</div>

					<div
						className="pf-reveal-in mt-8 border-y-line border-t pt-6"
						style={{ "--i": 4 } as React.CSSProperties}
					>
						<p className="text-sm text-y-muted">Precisa de algo nessa linha?</p>
						<ContactTrigger
							interest={p.area ?? "geral"}
							className="group mt-2 inline-flex min-h-11 items-center gap-2 rounded-lg font-display font-semibold text-sm text-y-glow transition-colors hover:text-white"
						>
							Conversar sobre um projeto assim
							<ArrowUpRight
								className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								aria-hidden="true"
							/>
						</ContactTrigger>
					</div>
				</div>
			</div>
		</div>
	);
}

function MediaStage({ project: p }: { project: PortfolioProject }) {
	const slides = useMemo(() => buildSlides(p), [p]);
	const [index, setIndex] = useState(0);
	const [embedPlaying, setEmbedPlaying] = useState(false);
	const count = slides.length;
	const slide = slides[index];

	const go = (dir: number) => {
		setEmbedPlaying(false);
		setIndex((i) => (i + dir + count) % count);
	};

	if (!count) {
		return (
			<div
				className="pf-stage-media pf-reveal-in"
				style={{ "--i": 0 } as React.CSSProperties}
			>
				<div className="pf-stage-frame">
					<MediaFallback seed={p.slug} title={p.title} area={p.area} />
				</div>
			</div>
		);
	}

	return (
		<div
			className="pf-stage-media pf-reveal-in"
			style={{ "--i": 0 } as React.CSSProperties}
		>
			<section
				className="pf-stage-frame"
				aria-roledescription="carrossel"
				aria-label={`Mídias de ${p.title}`}
				onKeyDown={(e) => {
					if (count < 2) return;
					if (e.key === "ArrowRight") go(1);
					if (e.key === "ArrowLeft") go(-1);
				}}
			>
				{slide.kind === "image" ? (
					<Image
						key={slide.image.src}
						src={slide.image.src}
						alt={slide.image.alt || `Imagem do projeto ${p.title}`}
						fill
						sizes="(max-width: 1024px) 100vw, 60vw"
						unoptimized={isRemoteSrc(slide.image.src)}
						className="pf-stage-img"
					/>
				) : null}

				{slide.kind === "video-file" ? (
					// biome-ignore lint/a11y/useMediaCaption: vídeos de demonstração sem áudio narrado
					<video
						key={slide.src}
						src={slide.src}
						poster={slide.poster ?? undefined}
						controls
						playsInline
						preload="metadata"
						className="pf-stage-video"
					/>
				) : null}

				{slide.kind === "video-embed" ? (
					embedPlaying ? (
						<iframe
							src={embedSrc(slide.url)}
							title={`Vídeo de demonstração: ${p.title}`}
							className="absolute inset-0 size-full"
							allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
							allowFullScreen
							loading="lazy"
						/>
					) : (
						<button
							type="button"
							className="pf-embed-facade"
							onClick={() => setEmbedPlaying(true)}
						>
							{embedThumbnail(slide.url) ? (
								// biome-ignore lint/performance/noImgElement: miniatura externa leve, carregada sob demanda
								<img
									src={embedThumbnail(slide.url) ?? ""}
									alt=""
									loading="lazy"
									className="absolute inset-0 size-full object-cover"
								/>
							) : (
								<MediaFallback seed={p.slug} title={p.title} area={p.area} />
							)}
							<span className="pf-play">
								<Play className="size-6 translate-x-0.5" aria-hidden="true" />
							</span>
							<span className="sr-only">Reproduzir vídeo de demonstração</span>
						</button>
					)
				) : null}

				{count > 1 ? (
					<>
						<button
							type="button"
							className="pf-stage-arrow left-3"
							onClick={() => go(-1)}
							aria-label="Mídia anterior"
						>
							<ChevronLeft className="size-5" aria-hidden="true" />
						</button>
						<button
							type="button"
							className="pf-stage-arrow right-3"
							onClick={() => go(1)}
							aria-label="Próxima mídia"
						>
							<ChevronRight className="size-5" aria-hidden="true" />
						</button>
						<p className="pf-stage-count" aria-live="polite">
							{index + 1} / {count}
						</p>
					</>
				) : null}
			</section>

			{count > 1 ? (
				<ul className="pf-thumbs" aria-label="Escolher mídia">
					{slides.map((s, i) => {
						const thumb =
							s.kind === "image"
								? s.image.src
								: s.kind === "video-file"
									? s.poster
									: embedThumbnail(s.url);
						return (
							<li
								key={
									s.kind === "image"
										? s.image.src
										: s.kind === "video-file"
											? s.src
											: s.url
								}
							>
								<button
									type="button"
									className="pf-thumb"
									data-active={i === index ? "true" : "false"}
									aria-current={i === index ? "true" : undefined}
									aria-label={
										s.kind === "image"
											? `Imagem ${i + 1}`
											: "Vídeo de demonstração"
									}
									onClick={() => {
										setEmbedPlaying(false);
										setIndex(i);
									}}
								>
									{thumb ? (
										// biome-ignore lint/performance/noImgElement: miniatura pequena
										<img src={thumb} alt="" loading="lazy" />
									) : (
										<ImageIcon className="size-4" aria-hidden="true" />
									)}
									{s.kind !== "image" ? (
										<span className="pf-thumb-play">
											<Play className="size-3" aria-hidden="true" />
										</span>
									) : null}
								</button>
							</li>
						);
					})}
				</ul>
			) : null}
		</div>
	);
}
