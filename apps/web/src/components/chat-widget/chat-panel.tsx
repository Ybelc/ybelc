"use client";

import { X } from "lucide-react";

import { ChatComposer } from "./chat-composer";
import { ChatMessageList } from "./chat-message-list";
import type { ChatMessage } from "./use-chat-flow";

type Props = {
	isOpen: boolean;
	messages: ChatMessage[];
	composerDisabled: boolean;
	composerPlaceholder: string;
	isSubmitting: boolean;
	onClose: () => void;
	onSend: (text: string) => void | Promise<void>;
};

export function ChatPanel({
	isOpen,
	messages,
	composerDisabled,
	composerPlaceholder,
	isSubmitting,
	onClose,
	onSend,
}: Props) {
	return (
		<>
			{isOpen && (
				<button
					type="button"
					className="fixed inset-0 z-[59] bg-y-ink/60 backdrop-blur-[1px] md:bg-transparent md:backdrop-blur-none"
					onClick={onClose}
					aria-label="Fechar chat"
				/>
			)}

			<div
				role="dialog"
				aria-modal="true"
				aria-label="Chat de suporte Ybelc"
				className={`fixed z-[60] flex flex-col overflow-hidden border border-y-line bg-y-navy shadow-[0_30px_80px_-20px_rgb(35_61_255/0.5)] transition-all duration-300 ease-out ${
					isOpen
						? "pointer-events-auto translate-y-0 opacity-100"
						: "pointer-events-none translate-y-4 opacity-0"
				} inset-x-0 bottom-0 h-[85vh] rounded-t-2xl md:inset-x-auto md:right-6 md:bottom-6 md:h-[min(600px,calc(100vh-48px))] md:w-[380px] md:rounded-2xl`}
			>
				<header className="flex shrink-0 items-center justify-between border-b border-y-line bg-y-blue px-4 py-3 text-white">
					<div>
						<p className="font-display font-semibold text-sm tracking-wide">Suporte Ybelc</p>
						<p className="text-xs text-white/80">Responderemos pelo seu e-mail</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
						aria-label="Fechar painel de chat"
					>
						<X className="size-4" />
					</button>
				</header>

				<ChatMessageList messages={messages} />

				<ChatComposer
					disabled={composerDisabled}
					isSubmitting={isSubmitting}
					placeholder={composerPlaceholder}
					onSend={onSend}
				/>
			</div>
		</>
	);
}
