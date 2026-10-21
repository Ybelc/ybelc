import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import {
	type PortfolioProject,
	type PortfolioProjectInput,
	portfolioProjectSchema,
	slugify,
} from "./schema";

/**
 * Armazenamento local do Portfólio (arquivo JSON versionado no repositório).
 * Usado pelo painel /admin/portfolio, que só funciona em desenvolvimento.
 */

const APP_ROOT = process.cwd();
export const PROJECTS_FILE = path.join(
	APP_ROOT,
	"content",
	"portfolio",
	"projects.json",
);
export const UPLOADS_DIR = path.join(
	APP_ROOT,
	"public",
	"portfolio",
	"uploads",
);
export const UPLOADS_PUBLIC_PATH = "/portfolio/uploads";

export async function readLocalProjects(): Promise<PortfolioProject[]> {
	let raw: string;
	try {
		raw = await readFile(PROJECTS_FILE, "utf8");
	} catch {
		return [];
	}
	const json = JSON.parse(raw) as { projects?: unknown[] };
	const out: PortfolioProject[] = [];
	for (const item of json.projects ?? []) {
		const parsed = portfolioProjectSchema.safeParse(item);
		if (parsed.success) out.push(parsed.data);
	}
	return out;
}

async function writeLocalProjects(projects: PortfolioProject[]) {
	await mkdir(path.dirname(PROJECTS_FILE), { recursive: true });
	const tmp = `${PROJECTS_FILE}.tmp`;
	await writeFile(tmp, `${JSON.stringify({ projects }, null, "\t")}\n`, "utf8");
	await rename(tmp, PROJECTS_FILE);
}

export class PortfolioValidationError extends Error {
	constructor(
		message: string,
		public issues: { path: string; message: string }[],
	) {
		super(message);
	}
}

function validate(input: PortfolioProjectInput): PortfolioProject {
	const parsed = portfolioProjectSchema.safeParse(input);
	if (!parsed.success) {
		throw new PortfolioValidationError(
			"Dados inválidos",
			parsed.error.issues.map((i) => ({
				path: i.path.join("."),
				message: i.message,
			})),
		);
	}
	return parsed.data;
}

function uniqueSlug(
	base: string,
	projects: PortfolioProject[],
	ignoreId?: string,
) {
	const root = slugify(base) || "projeto";
	let slug = root;
	let n = 2;
	while (projects.some((p) => p.slug === slug && p.id !== ignoreId)) {
		slug = `${root}-${n++}`;
	}
	return slug;
}

export async function createLocalProject(
	input: Omit<PortfolioProjectInput, "id">,
) {
	const projects = await readLocalProjects();
	const now = new Date().toISOString();
	const project = validate({
		...input,
		id: randomUUID(),
		slug: uniqueSlug(input.slug || input.title, projects),
		display_order:
			input.display_order ??
			(projects.length
				? Math.max(...projects.map((p) => p.display_order)) + 1
				: 1),
		created_at: now,
		updated_at: now,
	});
	await writeLocalProjects([...projects, project]);
	return project;
}

export async function updateLocalProject(
	id: string,
	input: PortfolioProjectInput,
) {
	const projects = await readLocalProjects();
	const current = projects.find((p) => p.id === id);
	if (!current) return null;
	const project = validate({
		...input,
		id,
		slug: uniqueSlug(input.slug || input.title, projects, id),
		created_at: current.created_at,
		updated_at: new Date().toISOString(),
	});
	await writeLocalProjects(projects.map((p) => (p.id === id ? project : p)));
	return project;
}

export async function deleteLocalProject(id: string) {
	const projects = await readLocalProjects();
	const next = projects.filter((p) => p.id !== id);
	if (next.length === projects.length) return false;
	await writeLocalProjects(next);
	return true;
}

/** Reordena conforme a lista de ids recebida (display_order = posição). */
export async function reorderLocalProjects(ids: string[]) {
	const projects = await readLocalProjects();
	const pos = new Map(ids.map((id, i) => [id, i + 1]));
	const next = projects.map((p) =>
		pos.has(p.id)
			? { ...p, display_order: pos.get(p.id) ?? p.display_order }
			: p,
	);
	await writeLocalProjects(next);
	return next;
}

const ALLOWED_UPLOADS: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/avif": "avif",
	"image/gif": "gif",
	"image/svg+xml": "svg",
	"video/mp4": "mp4",
	"video/webm": "webm",
};

export const MAX_UPLOAD_BYTES = 80 * 1024 * 1024;

export async function saveUpload(
	file: File,
): Promise<{ src: string; kind: "image" | "video" }> {
	const ext = ALLOWED_UPLOADS[file.type];
	if (!ext)
		throw new PortfolioValidationError(
			`Tipo de arquivo não suportado: ${file.type || "desconhecido"}`,
			[],
		);
	if (file.size > MAX_UPLOAD_BYTES)
		throw new PortfolioValidationError("Arquivo maior que 80 MB", []);

	const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "midia";
	const name = `${base}-${randomUUID().slice(0, 8)}.${ext}`;
	await mkdir(UPLOADS_DIR, { recursive: true });
	await writeFile(
		path.join(UPLOADS_DIR, name),
		Buffer.from(await file.arrayBuffer()),
	);
	return {
		src: `${UPLOADS_PUBLIC_PATH}/${name}`,
		kind: file.type.startsWith("video/") ? "video" : "image",
	};
}
