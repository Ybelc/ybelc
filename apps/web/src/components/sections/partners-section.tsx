import Image from "next/image";

import { partners } from "@/lib/legacy/ybelc-page-content";

export function PartnersSection() {
	return (
		<section
			id="parceiros"
			className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
			aria-labelledby="parceiros-heading"
		>
			<div className="mx-auto max-w-7xl">
				<div className="mx-auto max-w-3xl text-center">
					<h2
						id="parceiros-heading"
						className="font-display font-extrabold text-econ-dark text-2xl uppercase tracking-wide sm:text-3xl"
					>
						{partners.heading}
					</h2>
					<p className="mt-4 text-base text-econ-dark/80 leading-relaxed sm:text-lg">
						{partners.subheading}
					</p>
				</div>

				<ul className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
					{partners.items.map((partner) => (
						<li key={partner.name} className="flex max-w-xs items-center justify-center sm:max-w-sm">
							<Image
								src={partner.image}
								alt={partner.name}
								width={partner.width}
								height={partner.height}
								className="h-16 w-auto object-contain sm:h-20 lg:h-24"
							/>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
