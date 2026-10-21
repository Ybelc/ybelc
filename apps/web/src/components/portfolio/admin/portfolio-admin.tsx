"use client";

import {
	ArrowDown,
	ArrowUp,
	ExternalLink,
	Film,
	ImagePlus,
	Loader2,
	Plus,
	Save,
	Star,
	Trash2,
	Upload,
	X,
} from "lucide-react";
import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
	PORTFOLIO_AREAS,
	type PortfolioArea,
	type PortfolioImage,
	type PortfolioProject,
	type PortfolioStatus,
	slugify,
} from "@/lib/portfolio/schema";

/* -------------------------------------------------------------------------- */
/*                                   Tipos                                    */
/* -------------------------------------------------------------------------- */

type Draft = {
	id: string | null;
	title: string;
	slug: string;
	tagline: string;
	short_description: string;
	full_description: string;
	category: string;
	area: PortfolioArea | "";
	technologies: string;
	cover_image: PortfolioImage | null;
	gallery: PortfolioImage[];
	videoKind: "none" | "file" | "embed";
	videoSrc: string;
	videoPoster: string;
	videoUrl: string;
	project_url: string;
	demo_url: string;
	repository_url: string;
	year: string;
	is_featured: boolean;
	display_order: string;
	status: PortfolioStatus;
};

const areaLabels: Record<PortfolioArea, string> = {
	software: "Software e sistemas",
	automacao: "Casa inteligente e automação",
	iot: "Internet das Coisas (IoT)",
	seguranca: "Segurança tecnológica",
};

const statusLabels: Record<PortfolioStatus, string> = {
	draft: "Rascunho",
	published: "Publicado",
	archived: "Arquivado",
};

function emptyDraft(order: number): Draft {
	return {
		id: null,
		title: "",
		slug: "",
		tagline: "",
		short_description: "",
		full_description: "",
		category: "",
		area: "",
		technologies: "",
		cover_image: null,
		gallery: [],
		videoKind: "none",
		videoSrc: "",
		videoPoster: "",
		videoUrl: "",
		project_url: "",
		demo_url: "",
		repository_url: "",
		year: String(new Date().getFullYear()),
		is_featured: false,
		display_order: String(order),
		status: "draft",
	};
}

function toDraft(p: PortfolioProject): Draft {
	return {
		id: p.id,
		title: p.title,
		slug: p.slug,
		tagline: p.tagline,
		short_description: p.short_description,
		full_description: p.full_description,
		category: p.category,
		area: p.area ?? "",
		technologies: p.technologies.join(", "),
		cover_image: p.cover_image,
		gallery: p.gallery,
		videoKind: p.video?.kind ?? "none",
		videoSrc: p.video?.kind === "file" ? p.video.src : "",
		videoPoster: p.video?.kind === "file" ? (p.video.poster ?? "") : "",
		videoUrl: p.video?.kind === "embed" ? p.video.url : "",
		project_url: p.project_url ?? "",
		demo_url: p.demo_url ?? "",
		repository_url: p.repository_url ?? "",
		year: p.year ? String(p.year) : "",
		is_featured: p.is_featured,
		display_order: String(p.display_order),
		status: p.status,
	};
}

function toPayload(d: Draft) {
	return {
		title: d.title,
		slug: d.slug || slugify(d.title),
		tagline: d.tagline,
		short_description: d.short_description,
		full_description: d.full_description,
		category: d.category,
		area: d.area || null,
		technologies: d.technologies
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean),
		cover_image: d.cover_image?.src ? d.cover_image : null,
		gallery: d.gallery.filter((g) => g.src),
		video:
			d.videoKind === "file" && d.videoSrc
				? { kind: "file", src: d.videoSrc, poster: d.videoPoster || null }
				: d.videoKind === "embed" && d.videoUrl
					? { kind: "embed", url: d.videoUrl }
					: null,
		project_url: d.project_url || null,
		demo_url: d.demo_url || null,
		repository_url: d.repository_url || null,
		year: d.year ? Number(d.year) : null,
		is_featured: d.is_featured,
		display_order: Number(d.display_order) || 0,
		status: d.status,
	};
}

async function uploadFile(file: File): Promise<string> {
	const form = new FormData();
	form.append("file", file);
	const res = await fetch("/api/portfolio/admin/upload", {
		method: "POST",
		body: form,
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error ?? "Falha no upload");
	return data.src as string;
}

/* -------------------------------------------------------------------------- */
/*                                   Estilos                                  */
/* -------------------------------------------------------------------------- */

const inputCls =
	"w-full rounded-lg border border-y-line bg-y-ink/70 px-3 py-2 text-sm text-y-fg placeholder:text-y-muted/50 transition-colors focus:border-y-glow focus:outline-none";
const labelCls =
	"mb-1.5 block font-mono text-[0.6875rem] text-y-glow uppercase tracking-[0.14em]";
const sectionCls = "rounded-2xl border border-y-line bg-y-surface/60 p-5";

function Field({
	label,
	hint,
	children,
	className = "",
}: {
	label: string;
	hint?: string;
	children: (id: string) => React.ReactNode;
	className?: string;
}) {
	const id = useId();
	return (
		<div className={className}>
			<label htmlFor={id} className={labelCls}>
				{label}
			</label>
			{children(id)}
			{hint ? <p className="mt-1 text-xs text-y-muted/80">{hint}</p> : null}
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                                   Painel                                   */
/* -------------------------------------------------------------------------- */

export function PortfolioAdmin({
	initialProjects,
	liveSource,
}: {
	initialProjects: PortfolioProject[];
	liveSource: "api" | "local";
}) {
	const [projects, setProjects] = useState(initialProjects);
	const [draft, setDraft] = useState<Draft>(() =>
		initialProjects[0] ? toDraft(initialProjects[0]) : emptyDraft(1),
	);
	const [saving, setSaving] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [issues, setIssues] = useState<{ path: string; message: string }[]>([]);

	const nextOrder = useMemo(
		() =>
			projects.length
				? Math.max(...projects.map((p) => p.display_order)) + 1
				: 1,
		[projects],
	);

	const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
		setDraft((d) => ({ ...d, [key]: value }));

	const select = (p: PortfolioProject | null) => {
		setDraft(p ? toDraft(p) : emptyDraft(nextOrder));
		setConfirmDelete(false);
		setIssues([]);
	};

	const save = async () => {
		setSaving(true);
		setIssues([]);
		try {
			const res = await fetch(
				draft.id
					? `/api/portfolio/admin/projects/${draft.id}`
					: "/api/portfolio/admin/projects",
				{
					method: draft.id ? "PUT" : "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(toPayload(draft)),
				},
			);
			const data = await res.json();
			if (!res.ok) {
				setIssues(data.issues ?? []);
				throw new Error(data.error ?? "Erro ao salvar");
			}
			const saved = data as PortfolioProject;
			setProjects((list) => {
				const exists = list.some((p) => p.id === saved.id);
				const next = exists
					? list.map((p) => (p.id === saved.id ? saved : p))
					: [...list, saved];
				return next.sort((a, b) => a.display_order - b.display_order);
			});
			// Só substitui o formulário se o usuário ainda estiver no mesmo projeto.
			setDraft((d) => (d.id === draft.id ? toDraft(saved) : d));
			toast.success(draft.id ? "Projeto atualizado" : "Projeto criado");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao salvar");
		} finally {
			setSaving(false);
		}
	};

	const remove = async () => {
		if (!draft.id) return;
		if (!confirmDelete) {
			setConfirmDelete(true);
			return;
		}
		const res = await fetch(`/api/portfolio/admin/projects/${draft.id}`, {
			method: "DELETE",
		});
		if (!res.ok) {
			toast.error("Não foi possível remover");
			return;
		}
		const next = projects.filter((p) => p.id !== draft.id);
		setProjects(next);
		const removedId = draft.id;
		setDraft((d) => (d.id === removedId ? (next[0] ? toDraft(next[0]) : emptyDraft(1)) : d));
		setConfirmDelete(false);
		toast.success("Projeto removido");
	};

	const move = async (id: string, dir: -1 | 1) => {
		const i = projects.findIndex((p) => p.id === id);
		const j = i + dir;
		if (i < 0 || j < 0 || j >= projects.length) return;
		const ids = projects.map((p) => p.id);
		[ids[i], ids[j]] = [ids[j], ids[i]];
		const res = await fetch("/api/portfolio/admin/projects/reorder", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ids }),
		});
		if (!res.ok) {
			toast.error("Não foi possível reordenar");
			return;
		}
		const data = (await res.json()) as { items: PortfolioProject[] };
		setProjects(data.items);
		const current = data.items.find((p) => p.id === draft.id);
		if (current) set("display_order", String(current.display_order));
	};

	return (
		<div className="min-h-screen bg-y-navy text-y-fg">
			<header className="sticky top-0 z-20 border-y-line border-b bg-y-navy/90 backdrop-blur-xl">
				<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
					<div>
						<p className="font-mono text-[0.6875rem] text-y-glow uppercase tracking-[0.16em]">
							Ybelc · Painel local (somente desenvolvimento)
						</p>
						<h1 className="font-display font-semibold text-2xl text-white">
							Gerenciar portfólio
						</h1>
					</div>
					<div className="flex flex-wrap gap-2">
						<Link
							href="/#portfolio"
							target="_blank"
							className="y-btn y-btn-ghost !min-h-10 !text-sm"
						>
							Ver na home <ExternalLink className="size-4" aria-hidden="true" />
						</Link>
						<Link
							href="/portfolio"
							target="_blank"
							className="y-btn y-btn-ghost !min-h-10 !text-sm"
						>
							Página /portfolio{" "}
							<ExternalLink className="size-4" aria-hidden="true" />
						</Link>
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
				<div className="mb-6 rounded-xl border border-y-line bg-y-ink/50 px-4 py-3 text-sm text-y-muted leading-relaxed">
					As alterações são gravadas em{" "}
					<code className="text-y-fg">
						apps/web/content/portfolio/projects.json
					</code>{" "}
					e as mídias em{" "}
					<code className="text-y-fg">apps/web/public/portfolio/uploads/</code>{" "}
					— faça commit desses arquivos para publicar. Apenas projetos com
					status <strong className="text-white">Publicado</strong> aparecem em
					produção (em dev, rascunhos também aparecem para pré-visualização).
					{liveSource === "api" ? (
						<span className="mt-2 block text-[#ffd58a]">
							Atenção: a vitrine está lendo os projetos da API
							(NEXT_PUBLIC_API_URL). Este painel edita apenas o arquivo local,
							usado como fallback ou com PORTFOLIO_SOURCE=local.
						</span>
					) : null}
				</div>

				<div className="grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
					{/* Lista ----------------------------------------------------- */}
					<aside className="lg:sticky lg:top-28 lg:self-start">
						<button
							type="button"
							className="y-btn y-btn-primary !text-sm mb-4 w-full"
							onClick={() => select(null)}
						>
							<Plus className="size-4" aria-hidden="true" /> Novo projeto
						</button>
						<ul className="grid gap-2">
							{projects.map((p, i) => (
								<li key={p.id}>
									<div
										className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors ${
											draft.id === p.id
												? "border-y-glow/60 bg-y-blue/15"
												: "border-y-line bg-y-surface/50 hover:border-y-glow/30"
										}`}
									>
										<button
											type="button"
											className="min-w-0 flex-1 text-left"
											onClick={() => select(p)}
										>
											<span className="flex items-center gap-1.5">
												{p.is_featured ? (
													<Star
														className="size-3.5 shrink-0 fill-y-glow text-y-glow"
														aria-label="Destaque"
													/>
												) : null}
												<span className="truncate font-medium text-sm text-white">
													{p.title}
												</span>
											</span>
											<span className="mt-0.5 flex items-center gap-2 font-mono text-[0.65rem] text-y-muted uppercase tracking-[0.1em]">
												<span
													className={
														p.status === "published"
															? "text-[#3ce8a0]"
															: p.status === "draft"
																? "text-[#ffd58a]"
																: "text-y-muted"
													}
												>
													{statusLabels[p.status]}
												</span>
												· #{p.display_order}
											</span>
										</button>
										<div className="flex flex-col">
											<button
												type="button"
												className="rounded p-0.5 text-y-muted hover:text-white disabled:opacity-30"
												disabled={i === 0}
												onClick={() => move(p.id, -1)}
												aria-label={`Mover ${p.title} para cima`}
											>
												<ArrowUp className="size-3.5" />
											</button>
											<button
												type="button"
												className="rounded p-0.5 text-y-muted hover:text-white disabled:opacity-30"
												disabled={i === projects.length - 1}
												onClick={() => move(p.id, 1)}
												aria-label={`Mover ${p.title} para baixo`}
											>
												<ArrowDown className="size-3.5" />
											</button>
										</div>
									</div>
								</li>
							))}
							{!projects.length ? (
								<li className="text-sm text-y-muted">
									Nenhum projeto cadastrado.
								</li>
							) : null}
						</ul>
					</aside>

					{/* Formulário ------------------------------------------------ */}
					<form
						className="grid gap-5"
						onSubmit={(e) => {
							e.preventDefault();
							save();
						}}
					>
						<div className="flex flex-wrap items-center justify-between gap-3">
							<h2 className="font-display font-semibold text-white text-xl">
								{draft.id
									? `Editando: ${draft.title || "sem título"}`
									: "Novo projeto"}
							</h2>
							<div className="flex gap-2">
								{draft.id ? (
									<button
										type="button"
										onClick={remove}
										onBlur={() => setConfirmDelete(false)}
										className={`y-btn !min-h-10 !text-sm ${confirmDelete ? "bg-red-600 text-white" : "y-btn-ghost text-red-300"}`}
									>
										<Trash2 className="size-4" aria-hidden="true" />
										{confirmDelete ? "Confirmar remoção" : "Remover"}
									</button>
								) : null}
								<button
									type="submit"
									disabled={saving}
									className="y-btn y-btn-primary !min-h-10 !text-sm"
								>
									{saving ? (
										<Loader2
											className="size-4 animate-spin"
											aria-hidden="true"
										/>
									) : (
										<Save className="size-4" aria-hidden="true" />
									)}
									Salvar
								</button>
							</div>
						</div>

						{issues.length ? (
							<ul
								className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-red-200 text-sm"
								role="alert"
							>
								{issues.map((i) => (
									<li key={`${i.path}-${i.message}`}>
										<strong>{i.path || "projeto"}:</strong> {i.message}
									</li>
								))}
							</ul>
						) : null}

						<section className={sectionCls}>
							<div className="grid gap-4 sm:grid-cols-2">
								<Field label="Título *" className="sm:col-span-2">
									{(id) => (
										<input
											id={id}
											required
											className={inputCls}
											value={draft.title}
											onChange={(e) => {
												const title = e.target.value;
												setDraft((d) => ({
													...d,
													title,
													slug:
														!d.id && (!d.slug || d.slug === slugify(d.title))
															? slugify(title)
															: d.slug,
												}));
											}}
										/>
									)}
								</Field>
								<Field
									label="Slug (URL)"
									hint="Usado no link direto: /#projeto-slug"
								>
									{(id) => (
										<input
											id={id}
											className={inputCls}
											value={draft.slug}
											onChange={(e) => set("slug", slugify(e.target.value))}
										/>
									)}
								</Field>
								<Field label="Categoria / área tecnológica">
									{(id) => (
										<input
											id={id}
											className={inputCls}
											placeholder="Ex.: Software sob medida"
											value={draft.category}
											onChange={(e) => set("category", e.target.value)}
										/>
									)}
								</Field>
								<Field
									label="Frase de impacto (máquina de escrever)"
									className="sm:col-span-2"
									hint="Curta e marcante — até ~60 caracteres."
								>
									{(id) => (
										<input
											id={id}
											maxLength={90}
											className={inputCls}
											value={draft.tagline}
											onChange={(e) => set("tagline", e.target.value)}
										/>
									)}
								</Field>
								<Field label="Descrição curta" className="sm:col-span-2">
									{(id) => (
										<textarea
											id={id}
											rows={2}
											maxLength={240}
											className={inputCls}
											value={draft.short_description}
											onChange={(e) => set("short_description", e.target.value)}
										/>
									)}
								</Field>
								<Field
									label="Descrição completa"
									className="sm:col-span-2"
									hint="Separe parágrafos com uma linha em branco."
								>
									{(id) => (
										<textarea
											id={id}
											rows={6}
											className={inputCls}
											value={draft.full_description}
											onChange={(e) => set("full_description", e.target.value)}
										/>
									)}
								</Field>
								<Field
									label="Tecnologias"
									className="sm:col-span-2"
									hint="Separadas por vírgula."
								>
									{(id) => (
										<input
											id={id}
											className={inputCls}
											placeholder="Next.js, PostgreSQL, MQTT"
											value={draft.technologies}
											onChange={(e) => set("technologies", e.target.value)}
										/>
									)}
								</Field>
								<Field label="Área Ybelc (ícone e visual alternativo)">
									{(id) => (
										<select
											id={id}
											className={inputCls}
											value={draft.area}
											onChange={(e) =>
												set("area", e.target.value as Draft["area"])
											}
										>
											<option value="">— Nenhuma —</option>
											{PORTFOLIO_AREAS.map((a) => (
												<option key={a} value={a}>
													{areaLabels[a]}
												</option>
											))}
										</select>
									)}
								</Field>
								<Field label="Ano">
									{(id) => (
										<input
											id={id}
											type="number"
											min={1990}
											max={2100}
											className={inputCls}
											value={draft.year}
											onChange={(e) => set("year", e.target.value)}
										/>
									)}
								</Field>
							</div>
						</section>

						<section className={sectionCls}>
							<h3 className="mb-4 font-display font-semibold text-white">
								Mídias
							</h3>
							<div className="grid gap-5">
								<ImageField
									label="Imagem de capa"
									value={draft.cover_image}
									onChange={(v) => set("cover_image", v)}
								/>

								<div>
									<p className={labelCls}>Galeria de imagens</p>
									<div className="grid gap-3">
										{draft.gallery.map((img, i) => (
											<ImageField
												// biome-ignore lint/suspicious/noArrayIndexKey: itens sem id próprio, editados por posição
												key={i}
												label={`Imagem ${i + 1}`}
												value={img}
												compact
												onChange={(v) =>
													set(
														"gallery",
														v
															? draft.gallery.map((g, j) => (j === i ? v : g))
															: draft.gallery.filter((_, j) => j !== i),
													)
												}
												onMove={(dir) => {
													const next = [...draft.gallery];
													const j = i + dir;
													if (j < 0 || j >= next.length) return;
													[next[i], next[j]] = [next[j], next[i]];
													set("gallery", next);
												}}
											/>
										))}
										<button
											type="button"
											className="y-btn y-btn-ghost !min-h-10 !text-sm justify-self-start"
											onClick={() =>
												set("gallery", [...draft.gallery, { src: "", alt: "" }])
											}
										>
											<ImagePlus className="size-4" aria-hidden="true" />{" "}
											Adicionar imagem
										</button>
									</div>
								</div>

								<div>
									<p className={labelCls}>Vídeo de demonstração</p>
									<fieldset className="flex flex-wrap gap-2">
										<legend className="sr-only">Tipo de vídeo</legend>
										{(
											[
												["none", "Sem vídeo"],
												["file", "Arquivo (mp4/webm)"],
												["embed", "YouTube / Vimeo / iframe"],
											] as const
										).map(([k, l]) => (
											<button
												key={k}
												type="button"
												aria-pressed={draft.videoKind === k}
												onClick={() => set("videoKind", k)}
												className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
													draft.videoKind === k
														? "border-y-glow bg-y-blue/30 text-white"
														: "border-y-line text-y-muted hover:text-white"
												}`}
											>
												{l}
											</button>
										))}
									</fieldset>

									{draft.videoKind === "file" ? (
										<div className="mt-3 grid gap-3 sm:grid-cols-2">
											<UploadInput
												label="Arquivo de vídeo"
												accept="video/mp4,video/webm"
												value={draft.videoSrc}
												onChange={(v) => set("videoSrc", v)}
												icon={<Film className="size-4" aria-hidden="true" />}
											/>
											<UploadInput
												label="Pôster (opcional)"
												accept="image/*"
												value={draft.videoPoster}
												onChange={(v) => set("videoPoster", v)}
											/>
											{draft.videoSrc ? (
												<video
													src={draft.videoSrc}
													poster={draft.videoPoster || undefined}
													controls
													muted
													className="aspect-video w-full rounded-xl border border-y-line bg-y-ink sm:col-span-2"
												/>
											) : null}
											<p className="text-xs text-y-muted sm:col-span-2">
												Na vitrine o vídeo toca sem som, em loop, apenas quando
												o projeto está em destaque. Prefira arquivos curtos (até
												~15 s) e leves (H.264, até ~8 MB).
											</p>
										</div>
									) : null}

									{draft.videoKind === "embed" ? (
										<Field
											label="URL do vídeo"
											className="mt-3"
											hint="Ex.: https://www.youtube.com/watch?v=… — carregado só quando o visitante clica."
										>
											{(id) => (
												<input
													id={id}
													type="url"
													className={inputCls}
													value={draft.videoUrl}
													onChange={(e) => set("videoUrl", e.target.value)}
												/>
											)}
										</Field>
									) : null}
								</div>
							</div>
						</section>

						<section className={sectionCls}>
							<h3 className="mb-4 font-display font-semibold text-white">
								Links
							</h3>
							<div className="grid gap-4 sm:grid-cols-3">
								<Field label="Página do projeto">
									{(id) => (
										<input
											id={id}
											type="url"
											className={inputCls}
											value={draft.project_url}
											onChange={(e) => set("project_url", e.target.value)}
										/>
									)}
								</Field>
								<Field label="Demonstração">
									{(id) => (
										<input
											id={id}
											type="url"
											className={inputCls}
											value={draft.demo_url}
											onChange={(e) => set("demo_url", e.target.value)}
										/>
									)}
								</Field>
								<Field label="Repositório (GitHub)">
									{(id) => (
										<input
											id={id}
											type="url"
											className={inputCls}
											value={draft.repository_url}
											onChange={(e) => set("repository_url", e.target.value)}
										/>
									)}
								</Field>
							</div>
						</section>

						<section className={sectionCls}>
							<h3 className="mb-4 font-display font-semibold text-white">
								Publicação
							</h3>
							<div className="grid items-end gap-4 sm:grid-cols-3">
								<Field label="Status">
									{(id) => (
										<select
											id={id}
											className={inputCls}
											value={draft.status}
											onChange={(e) =>
												set("status", e.target.value as PortfolioStatus)
											}
										>
											{(Object.keys(statusLabels) as PortfolioStatus[]).map(
												(s) => (
													<option key={s} value={s}>
														{statusLabels[s]}
													</option>
												),
											)}
										</select>
									)}
								</Field>
								<Field label="Ordem de exibição">
									{(id) => (
										<input
											id={id}
											type="number"
											className={inputCls}
											value={draft.display_order}
											onChange={(e) => set("display_order", e.target.value)}
										/>
									)}
								</Field>
								<label className="flex min-h-10 cursor-pointer items-center gap-2.5 text-sm">
									<input
										type="checkbox"
										className="size-4 accent-[#233dff]"
										checked={draft.is_featured}
										onChange={(e) => set("is_featured", e.target.checked)}
									/>
									Destacar na página inicial
								</label>
							</div>
						</section>
					</form>
				</div>
			</div>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                               Campos de mídia                              */
/* -------------------------------------------------------------------------- */

function UploadInput({
	label,
	accept,
	value,
	onChange,
	icon,
}: {
	label: string;
	accept: string;
	value: string;
	onChange: (v: string) => void;
	icon?: React.ReactNode;
}) {
	const fileRef = useRef<HTMLInputElement>(null);
	const [busy, setBusy] = useState(false);
	const id = useId();

	const onFile = async (file: File | undefined) => {
		if (!file) return;
		setBusy(true);
		try {
			onChange(await uploadFile(file));
			toast.success("Arquivo enviado");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Falha no upload");
		} finally {
			setBusy(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	};

	return (
		<div>
			<label htmlFor={id} className={labelCls}>
				{label}
			</label>
			<div className="flex gap-2">
				<input
					id={id}
					className={inputCls}
					placeholder="/portfolio/uploads/... ou https://..."
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
				<button
					type="button"
					className="y-btn y-btn-ghost !min-h-0 !px-3 !text-sm shrink-0"
					onClick={() => fileRef.current?.click()}
					disabled={busy}
					aria-label={`Enviar arquivo: ${label}`}
				>
					{busy ? (
						<Loader2 className="size-4 animate-spin" aria-hidden="true" />
					) : (
						(icon ?? <Upload className="size-4" aria-hidden="true" />)
					)}
				</button>
				<input
					ref={fileRef}
					type="file"
					accept={accept}
					className="hidden"
					tabIndex={-1}
					onChange={(e) => onFile(e.target.files?.[0])}
				/>
			</div>
		</div>
	);
}

function ImageField({
	label,
	value,
	onChange,
	onMove,
	compact = false,
}: {
	label: string;
	value: PortfolioImage | null;
	onChange: (v: PortfolioImage | null) => void;
	onMove?: (dir: -1 | 1) => void;
	compact?: boolean;
}) {
	const [dragOver, setDragOver] = useState(false);
	const [busy, setBusy] = useState(false);
	const altId = useId();

	const onDrop = async (file: File | undefined) => {
		if (!file?.type.startsWith("image/")) return;
		setBusy(true);
		try {
			onChange({ src: await uploadFile(file), alt: value?.alt ?? "" });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Falha no upload");
		} finally {
			setBusy(false);
		}
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: área opcional de arrastar e soltar (o upload também tem botão)
		<div
			className={`grid gap-3 rounded-xl border p-3 transition-colors sm:grid-cols-[9rem_minmax(0,1fr)] ${
				dragOver ? "border-y-glow bg-y-blue/10" : "border-y-line bg-y-ink/30"
			}`}
			onDragOver={(e) => {
				e.preventDefault();
				setDragOver(true);
			}}
			onDragLeave={() => setDragOver(false)}
			onDrop={(e) => {
				e.preventDefault();
				setDragOver(false);
				onDrop(e.dataTransfer.files?.[0]);
			}}
		>
			<div className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-lg border border-y-line bg-y-ink text-xs text-y-muted">
				{busy ? (
					<Loader2 className="size-5 animate-spin" aria-hidden="true" />
				) : value?.src ? (
					// biome-ignore lint/performance/noImgElement: pré-visualização no painel local
					<img
						src={value.src}
						alt=""
						className="absolute inset-0 size-full object-cover"
					/>
				) : (
					<span className="px-2 text-center">Arraste uma imagem</span>
				)}
			</div>
			<div className="grid gap-2">
				<UploadInput
					label={label}
					accept="image/*"
					value={value?.src ?? ""}
					onChange={(src) =>
						onChange(src || compact ? { src, alt: value?.alt ?? "" } : null)
					}
				/>
				<div className="flex gap-2">
					<div className="min-w-0 flex-1">
						<label htmlFor={altId} className="sr-only">
							Texto alternativo
						</label>
						<input
							id={altId}
							className={inputCls}
							placeholder="Texto alternativo (descreva a imagem)"
							value={value?.alt ?? ""}
							onChange={(e) =>
								onChange({ src: value?.src ?? "", alt: e.target.value })
							}
						/>
					</div>
					{onMove ? (
						<>
							<button
								type="button"
								className="y-btn y-btn-ghost !min-h-0 !px-2.5"
								onClick={() => onMove(-1)}
								aria-label="Mover para cima"
							>
								<ArrowUp className="size-4" />
							</button>
							<button
								type="button"
								className="y-btn y-btn-ghost !min-h-0 !px-2.5"
								onClick={() => onMove(1)}
								aria-label="Mover para baixo"
							>
								<ArrowDown className="size-4" />
							</button>
						</>
					) : null}
					{value ? (
						<button
							type="button"
							className="y-btn y-btn-ghost !min-h-0 !px-2.5 text-red-300"
							onClick={() => onChange(null)}
							aria-label="Remover imagem"
						>
							<X className="size-4" />
						</button>
					) : null}
				</div>
			</div>
		</div>
	);
}
