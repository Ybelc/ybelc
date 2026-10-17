"use client";

import type { ContactRequestInterest } from "@/components/sections/contact-request-dialog";

import { useContactDialog } from "./contact-dialog-provider";

type ContactTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
	interest?: ContactRequestInterest;
	onAfterOpen?: () => void;
};

/** Botão que abre o diálogo de solicitação de projeto (opcionalmente com a área pré-selecionada). */
export function ContactTrigger({ interest = "geral", onAfterOpen, children, ...props }: ContactTriggerProps) {
	const { openContact } = useContactDialog();
	return (
		<button
			type="button"
			aria-haspopup="dialog"
			{...props}
			onClick={() => {
				openContact(interest);
				onAfterOpen?.();
			}}
		>
			{children}
		</button>
	);
}
