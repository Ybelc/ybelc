"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import {
	ContactRequestDialog,
	type ContactRequestInterest,
} from "@/components/sections/contact-request-dialog";

type ContactDialogContextValue = {
	openContact: (interest?: ContactRequestInterest) => void;
};

const ContactDialogContext = createContext<ContactDialogContextValue | null>(null);

/** Disponibiliza um único diálogo de "Solicitar um projeto" para toda a aplicação. */
export function ContactDialogProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [interest, setInterest] = useState<ContactRequestInterest>("geral");

	const openContact = useCallback((next: ContactRequestInterest = "geral") => {
		setInterest(next);
		setOpen(true);
	}, []);

	const value = useMemo(() => ({ openContact }), [openContact]);

	return (
		<ContactDialogContext.Provider value={value}>
			{children}
			<ContactRequestDialog interest={interest} open={open} onOpenChange={setOpen} />
		</ContactDialogContext.Provider>
	);
}

export function useContactDialog() {
	const ctx = useContext(ContactDialogContext);
	if (!ctx) throw new Error("useContactDialog deve ser usado dentro de ContactDialogProvider");
	return ctx;
}
