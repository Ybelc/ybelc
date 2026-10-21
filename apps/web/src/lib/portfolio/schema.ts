import { z } from "zod";

/**
 * Contrato de dados do Portfólio.
 *
 * O mesmo schema valida:
 *  - a resposta da API (`GET {NEXT_PUBLIC_API_URL}/api/v1/portfolio/projects`), em snake_case
 *    como o restante da API (ver lib/blog.ts);
 *  - o arquivo local `apps/web/content/portfolio/projects.json`, editado pelo painel /admin/portfolio.
 *
 * Este módulo não usa APIs de servidor: pode ser importado por componentes client.
 */

export const PORTFOLIO_AREAS = [
	"software",
	"automacao",
	"iot",
	"seguranca",
] as const;
export type PortfolioArea = (typeof PORTFOLIO_AREAS)[number];

export const PORTFOLIO_STATUSES = ["draft", "published", "archived"] as const;
export type PortfolioStatus = (typeof PORTFOLIO_STATUSES)[number];

/** Aceita "", null ou undefined como "sem valor". */
const optionalText = z
	.string()
	.nullish()
	.transform((v) => (v?.trim() ? v.trim() : null));

/** URL absoluta (http/https) ou caminho público iniciado por "/". */
const mediaSrc = z
	.string()
	.trim()
	.min(1)
	.refine(
		(v) => v.startsWith("/") || /^https?:\/\//i.test(v),
		"Use uma URL http(s) ou um caminho iniciado por /",
	);

const optionalUrl = z
	.string()
	.nullish()
	.transform((v) => (v?.trim() ? v.trim() : null))
	.refine(
		(v) => v === null || /^https?:\/\//i.test(v) || v.startsWith("/"),
		"URL inválida",
	);

export const portfolioImageSchema = z.object({
	src: mediaSrc,
	alt: z
		.string()
		.nullish()
		.transform((v) => v ?? ""),
});
export type PortfolioImage = z.infer<typeof portfolioImageSchema>;

export const portfolioVideoSchema = z.discriminatedUnion("kind", [
	/** Arquivo de vídeo (mp4/webm) hospedado no próprio site ou em CDN. */
	z.object({
		kind: z.literal("file"),
		src: mediaSrc,
		poster: optionalText,
	}),
	/** Vídeo incorporado (YouTube, Vimeo ou qualquer URL de iframe). */
	z.object({
		kind: z.literal("embed"),
		url: z.string().trim().url(),
	}),
]);
export type PortfolioVideo = z.infer<typeof portfolioVideoSchema>;

export const portfolioProjectSchema = z.object({
	id: z.string().min(1),
	slug: z
		.string()
		.trim()
		.min(1)
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"Use apenas letras minúsculas, números e hífens",
		),
	title: z.string().trim().min(1),
	/** Frase curta de impacto exibida com efeito de máquina de escrever. */
	tagline: z
		.string()
		.nullish()
		.transform((v) => v ?? ""),
	short_description: z
		.string()
		.nullish()
		.transform((v) => v ?? ""),
	full_description: z
		.string()
		.nullish()
		.transform((v) => v ?? ""),
	category: z
		.string()
		.nullish()
		.transform((v) => v?.trim() || "Projeto"),
	/** Área da Ybelc (opcional) — define ícone e ilustração de fallback. */
	area: z
		.enum(PORTFOLIO_AREAS)
		.nullish()
		.transform((v) => v ?? null),
	technologies: z
		.array(z.string().trim().min(1))
		.nullish()
		.transform((v) => v ?? []),
	cover_image: portfolioImageSchema.nullish().transform((v) => v ?? null),
	gallery: z
		.array(portfolioImageSchema)
		.nullish()
		.transform((v) => v ?? []),
	video: portfolioVideoSchema.nullish().transform((v) => v ?? null),
	project_url: optionalUrl,
	demo_url: optionalUrl,
	repository_url: optionalUrl,
	year: z.coerce
		.number()
		.int()
		.min(1990)
		.max(2100)
		.nullish()
		.transform((v) => v ?? null),
	is_featured: z
		.boolean()
		.nullish()
		.transform((v) => v ?? false),
	display_order: z.coerce
		.number()
		.int()
		.nullish()
		.transform((v) => v ?? 0),
	status: z
		.enum(PORTFOLIO_STATUSES)
		.nullish()
		.transform((v) => v ?? "draft"),
	created_at: z
		.string()
		.nullish()
		.transform((v) => v ?? null),
	updated_at: z
		.string()
		.nullish()
		.transform((v) => v ?? null),
});

export type PortfolioProject = z.infer<typeof portfolioProjectSchema>;
/** Formato de entrada (antes das transformações) — útil para formulários. */
export type PortfolioProjectInput = z.input<typeof portfolioProjectSchema>;

export const portfolioFileSchema = z.object({
	projects: z.array(portfolioProjectSchema),
});

/* -------------------------------------------------------------------------- */
/*                               Helpers de mídia                             */
/* -------------------------------------------------------------------------- */

export function isRemoteSrc(src: string) {
	return /^https?:\/\//i.test(src);
}

export function youtubeId(url: string): string | null {
	const m = url.match(
		/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i,
	);
	return m ? m[1] : null;
}

export function vimeoId(url: string): string | null {
	const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
	return m ? m[1] : null;
}

/** Converte a URL informada em uma URL de iframe adequada (com autoplay após o clique do usuário). */
export function embedSrc(url: string, autoplay = true): string {
	const yt = youtubeId(url);
	if (yt) {
		return `https://www.youtube-nocookie.com/embed/${yt}?rel=0&modestbranding=1${autoplay ? "&autoplay=1" : ""}`;
	}
	const vm = vimeoId(url);
	if (vm)
		return `https://player.vimeo.com/video/${vm}?dnt=1${autoplay ? "&autoplay=1" : ""}`;
	return url;
}

/** Miniatura automática para vídeos incorporados, quando disponível. */
export function embedThumbnail(url: string): string | null {
	const yt = youtubeId(url);
	return yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : null;
}

/** Imagem que melhor representa o projeto (capa → pôster → miniatura → galeria). */
export function primaryImage(p: PortfolioProject): PortfolioImage | null {
	if (p.cover_image) return p.cover_image;
	if (p.video?.kind === "file" && p.video.poster)
		return { src: p.video.poster, alt: "" };
	if (p.video?.kind === "embed") {
		const thumb = embedThumbnail(p.video.url);
		if (thumb) return { src: thumb, alt: "" };
	}
	return p.gallery[0] ?? null;
}

export function sortProjects<T extends PortfolioProject>(items: T[]): T[] {
	return [...items].sort(
		(a, b) =>
			a.display_order - b.display_order ||
			Number(b.is_featured) - Number(a.is_featured) ||
			(b.updated_at ?? "").localeCompare(a.updated_at ?? ""),
	);
}

export function slugify(value: string) {
	return value
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80);
}
