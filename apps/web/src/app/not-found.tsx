import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function NotFound() {
	return (
		<>
			<SiteHeader />
			<main
				id="main-content"
				className="y-grid flex min-h-[70vh] flex-col items-center justify-center bg-y-navy px-4 text-center"
			>
				<p className="font-mono text-y-glow text-xs uppercase tracking-[0.16em]">
					404
				</p>
				<h1 className="mt-2 font-display font-semibold text-4xl text-white tracking-[-0.03em]">
					Página não encontrada
				</h1>
				<p className="mt-3 max-w-md text-y-muted leading-relaxed">
					O conteúdo que você procura não existe ou não está mais disponível.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<Link
						href="/"
						className="y-btn y-btn-primary"
					>
						Ir para o início
					</Link>
					<Link
						href="/blog"
						className="y-btn y-btn-ghost"
					>
						Ver blog
					</Link>
				</div>
			</main>
			<SiteFooter />
		</>
	);
}
