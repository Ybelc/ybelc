import { ArrowUpRight, Mail, Phone } from "lucide-react";

import { ContactTrigger } from "@/components/contact/contact-trigger";
import { Reveal } from "@/components/ui/reveal";
import { finalCta, siteConfig } from "@/lib/site-config";

export function FinalCtaSection() {
	const { email, phone } = siteConfig.contact;

	return (
		<section
			id="contato"
			className="relative scroll-mt-20 px-4 pb-24 sm:px-6 lg:px-8 lg:pb-28"
			aria-labelledby="contato-heading"
		>
			<Reveal className="mx-auto max-w-[76rem]">
				<div className="relative overflow-hidden rounded-[2rem] border border-y-glow/25 bg-gradient-to-br from-y-blue via-[#1b2fd1] to-y-navy px-6 py-16 sm:px-12 lg:px-16 lg:py-20">
					<div className="y-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top_right,#000,transparent_70%)]" aria-hidden="true" />
					<svg
						className="pointer-events-none absolute -right-10 -bottom-10 hidden h-80 w-80 text-white/15 md:block"
						viewBox="0 0 200 200"
						fill="none"
						aria-hidden="true"
					>
						<circle cx="100" cy="100" r="98" stroke="currentColor" />
						<circle cx="100" cy="100" r="70" stroke="currentColor" strokeDasharray="2 6" />
						<circle cx="100" cy="100" r="40" stroke="currentColor" />
						<path d="M100 2v58M100 140v58M2 100h58M140 100h58" stroke="currentColor" />
					</svg>

					<div className="relative max-w-2xl">
						<p className="y-eyebrow !text-white/80">{finalCta.eyebrow}</p>
						<h2
							id="contato-heading"
							className="mt-5 text-balance font-display font-semibold text-[clamp(2.1rem,5vw,3.75rem)] text-white leading-[1.03] tracking-[-0.035em]"
						>
							{finalCta.heading}
						</h2>
						<p className="mt-5 text-pretty text-lg text-white/80 leading-relaxed">{finalCta.subheading}</p>

						<div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
							<ContactTrigger className="y-btn bg-white text-y-navy shadow-[0_10px_40px_-10px_rgb(0_0_0/0.5)] hover:bg-white/90">
								{finalCta.primary}
								<ArrowUpRight className="size-4" aria-hidden="true" />
							</ContactTrigger>
							{email ? (
								<a href={`mailto:${email}`} className="y-btn border border-white/30 text-white hover:bg-white/10">
									<Mail className="size-4" aria-hidden="true" />
									{email}
								</a>
							) : null}
							{phone ? (
								<a
									href={`tel:${phone.replace(/[^\d+]/g, "")}`}
									className="y-btn border border-white/30 text-white hover:bg-white/10"
								>
									<Phone className="size-4" aria-hidden="true" />
									{phone}
								</a>
							) : null}
						</div>
					</div>
				</div>
			</Reveal>
		</section>
	);
}
