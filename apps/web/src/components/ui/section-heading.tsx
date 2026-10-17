type SectionHeadingProps = {
	id: string;
	eyebrow: string;
	title: string;
	description?: string;
	align?: "left" | "center";
};

export function SectionHeading({ id, eyebrow, title, description, align = "left" }: SectionHeadingProps) {
	const centered = align === "center";
	return (
		<div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
			<p className={`y-eyebrow ${centered ? "justify-center" : ""}`}>{eyebrow}</p>
			<h2
				id={id}
				className="mt-5 text-balance font-display font-semibold text-[clamp(2rem,4.4vw,3.25rem)] text-white leading-[1.06] tracking-[-0.03em]"
			>
				{title}
			</h2>
			{description ? (
				<p className="mt-5 max-w-2xl text-pretty text-lg text-y-muted leading-relaxed">{description}</p>
			) : null}
		</div>
	);
}
