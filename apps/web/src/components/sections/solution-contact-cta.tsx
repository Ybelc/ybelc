"use client";

import { useState } from "react";

import {
	ContactRequestDialog,
	type ContactRequestInterest,
} from "./contact-request-dialog";

type SolutionContactCtaProps = {
	interest: ContactRequestInterest;
	buttonLabel: string;
	dialogTitle: string;
	dialogDescription: string;
	requireAddress?: boolean;
};

export function SolutionContactCta({
	interest,
	buttonLabel,
	dialogTitle,
	dialogDescription,
	requireAddress = false,
}: SolutionContactCtaProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-econ-orange px-5 font-display font-semibold text-econ-orange text-sm tracking-wide transition-colors hover:bg-econ-orange hover:text-white"
			>
				{buttonLabel}
			</button>
			<ContactRequestDialog
				interest={interest}
				open={open}
				onOpenChange={setOpen}
				title={dialogTitle}
				description={dialogDescription}
				requireAddress={requireAddress}
			/>
		</>
	);
}
