import type { MetadataRoute } from "next";

import { listAllPublishedForSitemap } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await listAllPublishedForSitemap();

	const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
		url: `${siteConfig.url}/blog/${post.slug}`,
		lastModified: new Date(post.updated_at),
		changeFrequency: "weekly",
		priority: 0.7,
	}));

	return [
		{
			url: siteConfig.url,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${siteConfig.url}/blog`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.8,
		},
		...blogEntries,
	];
}
