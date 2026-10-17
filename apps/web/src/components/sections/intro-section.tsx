import { siteConfig } from "@/lib/site-config";

export function IntroSection() {
	return (
		<section
			id="sobre"
			className="bg-econ-cream px-4 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-12 lg:px-8 lg:pt-24 lg:pb-14"
			aria-labelledby="sobre-heading"
		>
			<div className="mx-auto max-w-3xl text-center">
				<h2
					id="sobre-heading"
					className="font-display font-extrabold text-econ-dark text-3xl uppercase tracking-wide sm:text-4xl"
				>
					{siteConfig.name}
				</h2>
				<p className="mt-6 font-display font-bold text-econ-green text-base leading-relaxed sm:text-lg">
					Nós somos uma CleanTech que tem como desafio oferecer soluções tecnológicas para a
					transição circular.
				</p>
			</div>
		</section>
	);
}
