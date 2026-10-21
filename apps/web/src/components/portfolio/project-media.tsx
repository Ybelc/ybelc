"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
	isRemoteSrc,
	type PortfolioProject,
	primaryImage,
} from "@/lib/portfolio/schema";

import { MediaFallback } from "./media-fallback";

type ProjectMediaProps = {
	project: PortfolioProject;
	/** Projeto em destaque no momento (controla a reprodução do vídeo de prévia). */
	active: boolean;
	/** A vitrine está visível na tela. */
	visible: boolean;
	reducedMotion: boolean;
	sizes?: string;
	priority?: boolean;
};

/**
 * Mídia de prévia de um projeto na vitrine.
 *  - Imagem de capa otimizada (lazy por padrão).
 *  - Vídeo (arquivo) só é baixado quando o projeto entra em destaque; toca mudo, em loop,
 *    e pausa quando outro projeto é selecionado ou a seção sai da tela.
 *  - Sem mídia: visual generativo alternativo.
 */
export function ProjectMedia({
	project,
	active,
	visible,
	reducedMotion,
	sizes = "(max-width: 1024px) 100vw, 60vw",
	priority = false,
}: ProjectMediaProps) {
	const image = primaryImage(project);
	const video = project.video?.kind === "file" ? project.video : null;
	const videoRef = useRef<HTMLVideoElement>(null);
	const [shouldLoad, setShouldLoad] = useState(false);
	const [ready, setReady] = useState(false);
	const [imgError, setImgError] = useState(false);

	const wantsPlay = Boolean(video) && active && visible && !reducedMotion;

	useEffect(() => {
		if (wantsPlay) setShouldLoad(true);
	}, [wantsPlay]);

	useEffect(() => {
		const el = videoRef.current;
		if (!el || !shouldLoad) return;
		if (wantsPlay) {
			el.play().catch(() => {});
		} else {
			el.pause();
		}
	}, [wantsPlay, shouldLoad]);

	if (!image && !video) {
		return (
			<MediaFallback
				seed={project.slug}
				title={project.title}
				area={project.area}
			/>
		);
	}

	return (
		<>
			{image && !imgError ? (
				<Image
					src={image.src}
					alt={image.alt || ""}
					fill
					sizes={sizes}
					priority={priority}
					unoptimized={isRemoteSrc(image.src)}
					className="pf-media-img"
					onError={() => setImgError(true)}
				/>
			) : !video ? (
				<MediaFallback
					seed={project.slug}
					title={project.title}
					area={project.area}
				/>
			) : null}

			{video ? (
				<video
					ref={videoRef}
					className="pf-media-video"
					data-ready={ready || !image ? "true" : "false"}
					src={shouldLoad || !image ? video.src : undefined}
					poster={video.poster ?? undefined}
					muted
					loop
					playsInline
					preload={image ? "none" : "metadata"}
					aria-hidden="true"
					tabIndex={-1}
					onCanPlay={() => setReady(true)}
				/>
			) : null}
		</>
	);
}
