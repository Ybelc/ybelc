"use client";

import { MessageCircle } from "lucide-react";

type Props = {
	isOpen: boolean;
	onClick: () => void;
};

export function ChatFab({ isOpen, onClick }: Props) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label="Abrir chat de suporte"
			aria-expanded={isOpen}
			className="group relative flex size-14 items-center justify-center rounded-full bg-y-blue text-white shadow-[0_10px_30px_-8px_rgb(35_61_255/0.9)] ring-1 ring-y-glow/40 transition-all duration-300 hover:scale-105 hover:bg-y-blue-strong hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-y-glow animate-in fade-in slide-in-from-bottom-4 duration-500"
		>
			<span
				className="absolute top-1 right-1 size-3 rounded-full border-2 border-y-navy bg-y-glow"
				aria-hidden
			/>
			<MessageCircle className="size-6 transition-transform duration-200 group-hover:scale-110" />
		</button>
	);
}
