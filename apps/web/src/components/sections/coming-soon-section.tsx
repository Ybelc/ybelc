"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";

type FormStatus = "idle" | "loading" | "success";

export function ComingSoonSection() {
	const [status, setStatus] = useState<FormStatus>("idle");
	const [error, setError] = useState<string | null>(null);
	const errorId = useId();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const email = new FormData(form).get("email");
		if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			setError("Informe um e-mail válido.");
			return;
		}

		setError(null);
		setStatus("loading");

		try {
			const response = await fetch("/api/newsletter/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email.trim() }),
			});

			if (!response.ok) {
				throw new Error(
					response.status === 503
						? "O cadastro ainda não está configurado neste ambiente."
						: "Não foi possível cadastrar. Tente novamente.",
				);
			}

			setStatus("success");
		} catch (err) {
			setStatus("idle");
			const message = err instanceof Error ? err.message : "Não foi possível cadastrar.";
			setError(message);
			toast.error(message);
		}
	}

	return (
		<section
			id="novidades"
			className="pb-16"
			aria-labelledby="novidades-heading"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="flex flex-col gap-6 rounded-2xl border border-y-line bg-y-surface/50 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
				<div className="max-w-xl">
					<h2 id="novidades-heading" className="font-display font-semibold text-white text-xl">
						Novidades e conteúdos técnicos
					</h2>
					<p className="mt-2 text-sm text-y-muted leading-relaxed">
						Cadastre seu e-mail para receber artigos sobre software, automação, IoT e segurança
						quando forem publicados.
					</p>
				</div>

				{status === "success" ? (
					<p className="flex items-center gap-2 font-medium text-y-glow" role="status">
						<CheckCircle2 className="size-5" aria-hidden="true" />
						Pronto! Avisaremos você por e-mail.
					</p>
				) : (
					<form noValidate className="w-full lg:max-w-md" onSubmit={handleSubmit}>
						<div className="flex flex-col gap-3 sm:flex-row">
							<label htmlFor="newsletter-email" className="sr-only">
								Seu e-mail
							</label>
							<input
								id="newsletter-email"
								name="email"
								type="email"
								required
								disabled={status === "loading"}
								placeholder="seu@email.com"
								autoComplete="email"
								aria-invalid={error ? true : undefined}
								aria-describedby={error ? errorId : undefined}
								onChange={() => error && setError(null)}
								className="h-[2.875rem] w-full min-w-0 sm:flex-1 rounded-xl border border-y-line bg-y-ink/60 px-4 text-[0.9375rem] text-y-fg outline-none transition-colors placeholder:text-y-muted/60 focus:border-y-glow focus:ring-2 focus:ring-y-blue/30 disabled:opacity-60"
							/>
							<button type="submit" disabled={status === "loading"} className="y-btn y-btn-primary">
								{status === "loading" ? (
									<>
										<Loader2 className="size-4 animate-spin" aria-hidden="true" />
										Enviando…
									</>
								) : (
									"Quero receber"
								)}
							</button>
						</div>
						{error ? (
							<p id={errorId} className="mt-2 text-red-300 text-sm" role="alert">
								{error}
							</p>
						) : null}
					</form>
				)}
			</div>
			</div>
		</section>
	);
}
