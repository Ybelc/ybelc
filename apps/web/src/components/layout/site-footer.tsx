import { Github, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { ContactTrigger } from "@/components/contact/contact-trigger";
import { hasPublishedPosts } from "@/lib/blog";
import { getFooterQuickLinks, hasContactInfo, siteConfig, solutions } from "@/lib/site-config";

const socialIcons = {
	LinkedIn: Linkedin,
	Instagram: Instagram,
	YouTube: Youtube,
	GitHub: Github,
} as const;

const linkClass = "text-sm text-y-muted transition-colors hover:text-white";

export async function SiteFooter() {
	const year = new Date().getFullYear();
	const showBlog = await hasPublishedPosts();
	const footerQuickLinks = getFooterQuickLinks(showBlog);
	const { email, phone, location } = siteConfig.contact;

	return (
		<footer className="relative border-y-line border-t bg-y-ink" aria-labelledby="footer-heading">
			<h2 id="footer-heading" className="sr-only">
				Rodapé
			</h2>
			<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
				<div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
					<div className="space-y-5 lg:col-span-4">
						<Logo href="/#inicio" size={52} />
						<p className="max-w-xs text-sm text-y-muted leading-relaxed">{siteConfig.tagline}</p>
						{siteConfig.social.length > 0 ? (
							<ul className="flex gap-2">
								{siteConfig.social.map((social) => {
									const Icon = socialIcons[social.label];
									return (
										<li key={social.label}>
											<a
												href={social.href}
												target="_blank"
												rel="noopener noreferrer"
												aria-label={social.label}
												className="flex size-11 items-center justify-center rounded-xl border border-y-line text-y-muted transition-colors hover:border-y-glow/50 hover:text-white"
											>
												<Icon className="size-5" aria-hidden="true" />
											</a>
										</li>
									);
								})}
							</ul>
						) : null}
					</div>

					<nav aria-labelledby="footer-nav" className="lg:col-span-2">
						<h3 id="footer-nav" className="font-mono text-[0.6875rem] text-y-glow uppercase tracking-[0.16em]">
							Navegação
						</h3>
						<ul className="mt-5 space-y-3">
							{footerQuickLinks.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className={linkClass}>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<nav aria-labelledby="footer-solucoes" className="lg:col-span-3">
						<h3
							id="footer-solucoes"
							className="font-mono text-[0.6875rem] text-y-glow uppercase tracking-[0.16em]"
						>
							Soluções
						</h3>
						<ul className="mt-5 space-y-3">
							{solutions.items.map((s) => (
								<li key={s.id}>
									<Link href={`/#solucao-${s.id}`} className={linkClass}>
										{s.title}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div className="lg:col-span-3">
						<h3 className="font-mono text-[0.6875rem] text-y-glow uppercase tracking-[0.16em]">Contato</h3>
						<ul className="mt-5 space-y-3 text-sm text-y-muted">
							{email ? (
								<li>
									<a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:text-white">
										<Mail className="size-4 shrink-0" aria-hidden="true" />
										{email}
									</a>
								</li>
							) : null}
							{phone ? (
								<li>
									<a
										href={`tel:${phone.replace(/[^\d+]/g, "")}`}
										className="inline-flex items-center gap-2 hover:text-white"
									>
										<Phone className="size-4 shrink-0" aria-hidden="true" />
										{phone}
									</a>
								</li>
							) : null}
							{location ? (
								<li className="inline-flex items-start gap-2">
									<MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
									{location}
								</li>
							) : null}
							{!hasContactInfo() ? (
								<li className="leading-relaxed">Fale com a equipe pelo formulário de projeto ou pelo chat.</li>
							) : null}
							<li>
								<ContactTrigger className="mt-1 inline-flex min-h-10 items-center rounded-lg font-display font-semibold text-sm text-y-glow hover:text-white">
									Solicitar um projeto →
								</ContactTrigger>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-14 flex flex-col gap-3 border-y-line border-t pt-6 text-xs text-y-muted/80 sm:flex-row sm:items-center sm:justify-between">
					<p>
						© {year} {siteConfig.legalName}. Todos os direitos reservados.
					</p>
					<p className="font-mono tracking-[0.08em]">Software · Automação · IoT · Segurança</p>
				</div>
			</div>
		</footer>
	);
}
