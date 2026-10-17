import { siteConfig } from "@/lib/site-config";

export type BlogCoverImage = {
	storage_key: string;
	public_url: string;
};

export type BlogPostStatus = "draft" | "scheduled" | "published" | "disabled";

export type BlogPostListItem = {
	id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	author: string | null;
	cover_image: BlogCoverImage | null;
	tags: string[];
	category: string | null;
	status: BlogPostStatus;
	publish_at: string | null;
	published_at: string | null;
	meta_title: string | null;
	meta_description: string | null;
	created_at: string;
	updated_at: string;
};

export type BlogPost = BlogPostListItem & {
	content: Record<string, unknown>;
	created_by: string | null;
};

export type BlogPostListResponse = {
	items: BlogPostListItem[];
	total: number;
	page: number;
	page_size: number;
	has_more: boolean;
};

function apiBase(): string {
	const base = siteConfig.api.replace(/\/$/, "");
	return base.endsWith("/api/v1") ? base : `${base}/api/v1`;
}

async function blogFetch<T>(
	path: string,
	init?: RequestInit,
): Promise<{ data: T | null; status: number }> {
	try {
		const res = await fetch(`${apiBase()}${path}`, {
			...init,
			next: { revalidate: 60, tags: ["blog"] },
			headers: {
				Accept: "application/json",
				...(init?.headers ?? {}),
			},
		});
		if (!res.ok) {
			return { data: null, status: res.status };
		}
		const data = (await res.json()) as T;
		return { data, status: res.status };
	} catch {
		return { data: null, status: 0 };
	}
}

export async function hasPublishedPosts(): Promise<boolean> {
	const { data } = await blogFetch<{ has_posts: boolean }>("/blog/posts/exists");
	return Boolean(data?.has_posts);
}

export async function listPublishedPosts(params?: {
	page?: number;
	page_size?: number;
	q?: string;
}): Promise<BlogPostListResponse> {
	const search = new URLSearchParams();
	search.set("page", String(params?.page ?? 1));
	search.set("page_size", String(params?.page_size ?? 12));
	if (params?.q) search.set("q", params.q);
	const { data } = await blogFetch<BlogPostListResponse>(
		`/blog/posts?${search.toString()}`,
	);
	return (
		data ?? {
			items: [],
			total: 0,
			page: 1,
			page_size: params?.page_size ?? 12,
			has_more: false,
		}
	);
}

export async function getPostBySlug(
	slug: string,
): Promise<{ post: BlogPost | null; status: number }> {
	const { data, status } = await blogFetch<BlogPost>(
		`/blog/posts/${encodeURIComponent(slug)}`,
	);
	return { post: data, status };
}

export async function listAllPublishedForSitemap(): Promise<BlogPostListItem[]> {
	const all: BlogPostListItem[] = [];
	let page = 1;
	let hasMore = true;
	while (hasMore && page <= 50) {
		const batch = await listPublishedPosts({ page, page_size: 100 });
		all.push(...batch.items);
		hasMore = batch.has_more;
		page += 1;
	}
	return all;
}
