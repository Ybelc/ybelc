import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BreadcrumbJsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { listPublishedPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 60;

export const metadata: Metadata = {
	title: "Blog",
	description:
		"Artigos e novidades da Ybelc sobre desenvolvimento de software, automação, Internet das Coisas e segurança.",
	alternates: {
		canonical: "/blog",
	},
	openGraph: {
		title: "Blog | Ybelc",
		description:
			"Artigos sobre software, automação, IoT e segurança.",
		url: `${siteConfig.url}/blog`,
		type: "website",
	},
};

function formatDate(value: string | null) {
	if (!value) return null;
	return new Date(value).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

export default async function BlogIndexPage() {
	const data = await listPublishedPosts({ page: 1, page_size: 24 });

	return (
		<>
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", href: "/" },
					{ name: "Blog", href: "/blog" },
				]}
			/>
			<SiteHeader />
			<main id="main-content" className="bg-y-navy min-h-[70vh]">
				<section className="border-b border-y-line bg-y-ink">
					<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
						<p className="mb-2 font-mono text-y-glow text-xs uppercase tracking-[0.16em]">
							Conteúdo
						</p>
						<h1 className="font-display font-semibold text-4xl text-white tracking-[-0.03em] sm:text-5xl">
							Blog Ybelc
						</h1>
						<p className="mt-3 max-w-2xl text-y-muted leading-relaxed">
							Ideias, análises e novidades sobre software, automação, Internet das
							Coisas e segurança tecnológica.
						</p>
					</div>
				</section>

				<section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
					{data.items.length === 0 ? (
						<p className="text-y-muted">Nenhum artigo publicado no momento.</p>
					) : (
						<ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
							{data.items.map((post) => {
								const dateLabel = formatDate(
									post.published_at ?? post.publish_at,
								);
								return (
									<li key={post.id}>
										<article className="flex h-full flex-col overflow-hidden rounded-2xl border border-y-line bg-y-surface transition-all hover:border-y-glow/40 hover:-translate-y-0.5">
											{post.cover_image?.public_url ? (
												<div className="relative aspect-[16/10] bg-y-ink">
													<Image
														src={post.cover_image.public_url}
														alt=""
														fill
														className="object-cover"
														sizes="(max-width: 768px) 100vw, 33vw"
														unoptimized
													/>
												</div>
											) : (
												<div className="aspect-[16/10] bg-gradient-to-br from-y-blue/30 to-y-ink" />
											)}
											<div className="flex flex-1 flex-col gap-3 p-5">
												{dateLabel ? (
													<time
														dateTime={post.published_at ?? post.publish_at ?? undefined}
														className="text-y-glow text-xs font-semibold uppercase tracking-wide"
													>
														{dateLabel}
													</time>
												) : null}
												<h2 className="font-display font-bold text-y-fg text-lg leading-snug">
													<Link
														href={`/blog/${post.slug}`}
														className="hover:text-white"
													>
														{post.title}
													</Link>
												</h2>
												{post.excerpt ? (
													<p className="line-clamp-3 text-sm text-y-muted leading-relaxed">
														{post.excerpt}
													</p>
												) : null}
												<div className="mt-auto pt-2">
													<Link
														href={`/blog/${post.slug}`}
														className="font-display font-semibold text-y-glow text-sm tracking-wide hover:underline"
													>
														Ler artigo →
													</Link>
												</div>
											</div>
										</article>
									</li>
								);
							})}
						</ul>
					)}
				</section>
			</main>
			<SiteFooter />
		</>
	);
}
