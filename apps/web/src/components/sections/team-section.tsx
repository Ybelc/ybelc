import Image from "next/image";

import { team } from "@/lib/legacy/ybelc-page-content";

export function TeamSection() {
	return (
		<section
			className="bg-econ-cream px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24"
			aria-labelledby="time-heading"
		>
			<div className="mx-auto max-w-7xl">
				<div className="mx-auto max-w-3xl text-center">
					<h2
						id="time-heading"
						className="font-display font-extrabold text-econ-dark text-2xl uppercase tracking-wide sm:text-3xl"
					>
						{team.heading}
					</h2>
					<p className="mt-4 text-econ-dark/80 text-base leading-relaxed sm:text-lg">
						{team.subheading}
					</p>
				</div>

				<ul className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-8">
					{team.members.map((member) => (
						<li
							key={member.name}
							className="w-full max-w-sm sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.375rem)]"
						>
							<article className="group flex h-full flex-col items-center rounded-xl bg-white px-6 py-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:px-7 sm:py-10">
								<div className="relative size-36 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-econ-green/45 bg-econ-cream p-1.5 transition-colors duration-300 group-hover:border-econ-green sm:size-40">
									<div className="relative size-full overflow-hidden rounded-full">
										<Image
											src={member.image}
											alt={`Foto de ${member.name}`}
											fill
											sizes="160px"
											className="object-cover object-[center_18%] transition-transform duration-500 group-hover:scale-105"
										/>
									</div>
								</div>

								<div className="mt-6 space-y-2">
									<h3 className="font-display font-extrabold text-econ-dark text-lg uppercase tracking-wide sm:text-xl">
										{member.name}
									</h3>
									<p className="font-display font-bold text-econ-green text-sm uppercase tracking-widest">
										{member.role}
									</p>
									<span
										className="mx-auto mt-3 block h-0.5 w-10 rounded-full bg-econ-orange/80"
										aria-hidden="true"
									/>
									<p className="mt-3 text-econ-dark/80 text-sm leading-relaxed sm:text-base">
										{member.description}
									</p>
								</div>
							</article>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
