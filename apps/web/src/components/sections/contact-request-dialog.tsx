"use client";

import { Loader2, Send, X } from "lucide-react";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";

import { type SolutionArea, siteConfig, solutionLabels } from "@/lib/site-config";

/** "dmc" e "mri" são valores legados do projeto-base, mantidos por compatibilidade. */
export type ContactRequestInterest = SolutionArea | "geral" | "dmc" | "mri";

type ContactRequestDialogProps = {
	interest: ContactRequestInterest;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	description?: string;
	requireAddress?: boolean;
};

type FormState = {
	interest: ContactRequestInterest;
	name: string;
	company: string;
	email: string;
	phone: string;
	address: string;
	message: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const selectableInterests = Object.entries(solutionLabels) as [
	SolutionArea | "geral",
	string,
][];

const fieldClassName =
	"mt-1.5 w-full rounded-lg border border-y-line bg-y-ink/60 px-3.5 py-2.5 text-[0.9375rem] text-y-fg outline-none transition-colors placeholder:text-y-muted/60 focus:border-y-glow focus:ring-2 focus:ring-y-blue/30 aria-[invalid=true]:border-red-400/70";

const labelClassName = "block font-medium text-sm text-y-fg";

function validate(form: FormState, requireAddress: boolean): FieldErrors {
	const errors: FieldErrors = {};
	if (form.name.trim().length < 2) errors.name = "Informe seu nome.";
	if (!EMAIL_RE.test(form.email.trim())) errors.email = "Informe um e-mail válido.";
	if (form.phone.replace(/\D/g, "").length < 8) errors.phone = "Informe um telefone com DDD.";
	if (form.message.trim().length < 10)
		errors.message = "Descreva brevemente o projeto (mín. 10 caracteres).";
	if (requireAddress && !form.address.trim()) errors.address = "Informe o endereço.";
	return errors;
}

export function ContactRequestDialog({
	interest,
	open,
	onOpenChange,
	title = "Solicitar um projeto",
	description = "Conte um pouco sobre o que você precisa. Retornaremos pelo e-mail ou telefone informado.",
	requireAddress = false,
}: ContactRequestDialogProps) {
	const titleId = useId();
	const descId = useId();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const emptyForm: FormState = {
		interest,
		name: "",
		company: "",
		email: "",
		phone: "",
		address: "",
		message: "",
	};
	const [form, setForm] = useState<FormState>(emptyForm);
	const [errors, setErrors] = useState<FieldErrors>({});
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (open && !dialog.open) {
			dialog.showModal();
		} else if (!open && dialog.open) {
			dialog.close();
		}
	}, [open]);

	// Reinicia o formulário sempre que o diálogo abre (com a área pré-selecionada).
	useEffect(() => {
		if (open) {
			setForm((prev) => ({ ...prev, interest }));
		} else {
			setForm({ ...emptyForm });
			setErrors({});
			setSubmitError(null);
			setSubmitting(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, interest]);

	const updateField =
		(field: keyof FormState) =>
		(value: string): void => {
			setForm((prev) => ({ ...prev, [field]: value }));
			if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
		};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (submitting) return;

		const nextErrors = validate(form, requireAddress);
		setErrors(nextErrors);
		const firstInvalid = Object.keys(nextErrors)[0];
		if (firstInvalid) {
			dialogRef.current
				?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
				?.focus();
			return;
		}

		setSubmitting(true);
		setSubmitError(null);
		try {
			const response = await fetch("/api/support/contact-request", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					interest: form.interest,
					name: form.name.trim(),
					company: form.company.trim() || undefined,
					email: form.email.trim(),
					phone: form.phone.trim(),
					address: form.address.trim() || undefined,
					message: form.message.trim(),
				}),
			});

			if (!response.ok) {
				throw new Error(
					response.status === 503
						? "O canal de envio ainda não está configurado neste ambiente."
						: "Não foi possível enviar sua solicitação. Tente novamente em instantes.",
				);
			}

			toast.success("Solicitação enviada!", {
				description: "Recebemos seus dados e retornaremos em breve.",
			});
			onOpenChange(false);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Não foi possível enviar sua solicitação.";
			setSubmitError(message);
			toast.error("Falha no envio", { description: message });
		} finally {
			setSubmitting(false);
		}
	};

	const errorId = (field: keyof FormState) => `${titleId}-${field}-error`;
	const fieldProps = (field: keyof FormState) => ({
		name: field,
		"aria-invalid": errors[field] ? true : undefined,
		"aria-describedby": errors[field] ? errorId(field) : undefined,
	});
	const fieldError = (field: keyof FormState) =>
		errors[field] ? (
			<span id={errorId(field)} className="mt-1 block text-red-300 text-xs">
				{errors[field]}
			</span>
		) : null;

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby={titleId}
			aria-describedby={descId}
			className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-1.5rem)] max-w-xl overflow-y-auto rounded-2xl border border-y-line bg-y-surface p-0 text-y-fg shadow-[0_40px_120px_-30px_rgb(35_61_255/0.55)] backdrop:bg-y-ink/80 backdrop:backdrop-blur-sm"
			onClose={() => onOpenChange(false)}
			onClick={(event) => {
				if (event.target === dialogRef.current) onOpenChange(false);
			}}
		>
			<div className="relative flex items-start justify-between gap-4 border-y-line border-b px-5 py-5 sm:px-7">
				<div
					className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-y-glow/70 to-transparent"
					aria-hidden="true"
				/>
				<div>
					<p className="font-mono text-[0.6875rem] text-y-glow uppercase tracking-[0.16em]">
						Novo projeto
					</p>
					<h2 id={titleId} className="mt-1.5 font-display font-semibold text-xl sm:text-2xl">
						{title}
					</h2>
					<p id={descId} className="mt-1.5 text-sm text-y-muted leading-relaxed">
						{description}
					</p>
				</div>
				<button
					type="button"
					onClick={() => onOpenChange(false)}
					className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-y-muted transition-colors hover:bg-white/5 hover:text-y-fg"
					aria-label="Fechar"
				>
					<X className="size-5" aria-hidden="true" />
				</button>
			</div>

			<form noValidate onSubmit={handleSubmit} className="space-y-4 px-5 py-6 sm:px-7">
				<label className={labelClassName}>
					Área de interesse
					<select
						{...fieldProps("interest")}
						value={form.interest}
						onChange={(e) => updateField("interest")(e.target.value)}
						className={`${fieldClassName} appearance-none bg-[length:1rem] bg-[right_0.85rem_center] bg-no-repeat pr-10`}
						style={{
							backgroundImage:
								"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b9bff' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
						}}
					>
						{selectableInterests.map(([value, label]) => (
							<option key={value} value={value} className="bg-y-surface">
								{label}
							</option>
						))}
						{form.interest === "dmc" || form.interest === "mri" ? (
							<option value={form.interest}>{form.interest.toUpperCase()}</option>
						) : null}
					</select>
				</label>

				<div className="grid gap-4 sm:grid-cols-2">
					<label className={labelClassName}>
						Nome <span className="text-y-glow">*</span>
						<input
							{...fieldProps("name")}
							autoComplete="name"
							value={form.name}
							onChange={(e) => updateField("name")(e.target.value)}
							className={fieldClassName}
						/>
						{fieldError("name")}
					</label>
					<label className={labelClassName}>
						Empresa <span className="font-normal text-y-muted">(opcional)</span>
						<input
							{...fieldProps("company")}
							autoComplete="organization"
							value={form.company}
							onChange={(e) => updateField("company")(e.target.value)}
							className={fieldClassName}
						/>
					</label>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<label className={labelClassName}>
						E-mail <span className="text-y-glow">*</span>
						<input
							{...fieldProps("email")}
							type="email"
							inputMode="email"
							autoComplete="email"
							value={form.email}
							onChange={(e) => updateField("email")(e.target.value)}
							className={fieldClassName}
						/>
						{fieldError("email")}
					</label>
					<label className={labelClassName}>
						Telefone / WhatsApp <span className="text-y-glow">*</span>
						<input
							{...fieldProps("phone")}
							type="tel"
							inputMode="tel"
							autoComplete="tel"
							placeholder="(00) 00000-0000"
							value={form.phone}
							onChange={(e) => updateField("phone")(e.target.value)}
							className={fieldClassName}
						/>
						{fieldError("phone")}
					</label>
				</div>

				{requireAddress ? (
					<label className={labelClassName}>
						Endereço <span className="text-y-glow">*</span>
						<input
							{...fieldProps("address")}
							autoComplete="street-address"
							value={form.address}
							onChange={(e) => updateField("address")(e.target.value)}
							className={fieldClassName}
						/>
						{fieldError("address")}
					</label>
				) : null}

				<label className={labelClassName}>
					Sobre o projeto <span className="text-y-glow">*</span>
					<textarea
						{...fieldProps("message")}
						rows={4}
						placeholder="Ex.: preciso de um sistema para..., quero automatizar..., busco monitorar..."
						value={form.message}
						onChange={(e) => updateField("message")(e.target.value)}
						className={`${fieldClassName} resize-y`}
					/>
					{fieldError("message")}
				</label>

				{submitError ? (
					<div
						role="alert"
						className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200 text-sm leading-relaxed"
					>
						{submitError}
						{siteConfig.contact.email ? (
							<>
								{" "}
								Você também pode escrever para{" "}
								<a
									className="font-semibold underline underline-offset-2"
									href={`mailto:${siteConfig.contact.email}`}
								>
									{siteConfig.contact.email}
								</a>
								.
							</>
						) : null}
					</div>
				) : null}

				<div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
					<button type="button" onClick={() => onOpenChange(false)} className="y-btn y-btn-ghost">
						Cancelar
					</button>
					<button type="submit" disabled={submitting} className="y-btn y-btn-primary">
						{submitting ? (
							<>
								<Loader2 className="size-4 animate-spin" aria-hidden="true" />
								Enviando…
							</>
						) : (
							<>
								<Send className="size-4" aria-hidden="true" />
								Enviar solicitação
							</>
						)}
					</button>
				</div>
			</form>
		</dialog>
	);
}
