import type { BlogPost } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

export function OrganizationJsonLd() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: siteConfig.name,
		url: siteConfig.url,
		description: siteConfig.description,
		logo: `${siteConfig.url}${siteConfig.logo.src}`,
		...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
		...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
		...(siteConfig.social.length ? { sameAs: siteConfig.social.map((s) => s.href) } : {}),
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires inline script
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}

export function BlogPostingJsonLd({ post }: { post: BlogPost }) {
	const url = `${siteConfig.url}/blog/${post.slug}`;
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.meta_title || post.title,
		description:
			post.meta_description || post.excerpt || siteConfig.description,
		datePublished: post.published_at ?? post.publish_at ?? post.created_at,
		dateModified: post.updated_at,
		author: post.author
			? { "@type": "Person", name: post.author }
			: { "@type": "Organization", name: siteConfig.name },
		publisher: {
			"@type": "Organization",
			name: siteConfig.name,
			url: siteConfig.url,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": url,
		},
		url,
		...(post.cover_image?.public_url
			? { image: [post.cover_image.public_url] }
			: {}),
		...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires inline script
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}

export function BreadcrumbJsonLd({
	items,
}: {
	items: { name: string; href: string }[];
}) {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.href.startsWith("http")
				? item.href
				: `${siteConfig.url}${item.href}`,
		})),
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires inline script
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}
