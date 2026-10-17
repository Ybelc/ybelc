import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

type LogoProps = {
	className?: string;
	href?: string;
	/** Tamanho do símbolo em px (a logo é quadrada). */
	size?: number;
	/** Exibe o nome da marca ao lado do símbolo. */
	showName?: boolean;
	priority?: boolean;
};

/**
 * Logo original da Ybelc. O arquivo possui fundo navy (#050A30), igual ao fundo
 * do site, por isso é exibido sem filtros ou alterações de cor.
 */
export function Logo({
	className = "",
	href = "/#inicio",
	size = 44,
	showName = true,
	priority = false,
}: LogoProps) {
	return (
		<Link
			href={href}
			className={`group inline-flex items-center gap-3 rounded-xl ${className}`}
			aria-label={`${siteConfig.name} — início`}
		>
			<Image
				src={siteConfig.logo.src}
				alt=""
				width={siteConfig.logo.width}
				height={siteConfig.logo.height}
				style={{ width: size, height: size }}
				className="rounded-lg ring-1 ring-white/5 transition-shadow duration-300 group-hover:shadow-[0_0_24px_-4px_rgb(35_61_255/0.8)]"
				priority={priority}
			/>
			{showName ? (
				<span className="font-display font-semibold text-[1.3rem] text-white tracking-[0.08em]">
					YBELC
				</span>
			) : null}
		</Link>
	);
}
