"use client";

import { useCallback, useRef, useState } from "react";

import { CHAT_COPY, isValidEmail } from "./chat-copy";

export type ChatMessageRole = "bot" | "user";

export type ChatMessage = {
	id: string;
	role: ChatMessageRole;
	body: string;
	timestamp: number;
};

export type ChatStep = "awaiting_message" | "awaiting_email" | "completed";

type UseChatFlowOptions = {
	onOpen?: () => void;
};

function createMessage(role: ChatMessageRole, body: string): ChatMessage {
	return {
		id: crypto.randomUUID(),
		role,
		body,
		timestamp: Date.now(),
	};
}

export function useChatFlow({ onOpen }: UseChatFlowOptions = {}) {
	const [isOpen, setIsOpen] = useState(false);
	const [step, setStep] = useState<ChatStep>("awaiting_message");
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const userMessageRef = useRef("");

	const appendMessage = useCallback((role: ChatMessageRole, body: string) => {
		setMessages((prev) => [...prev, createMessage(role, body)]);
	}, []);

	const open = useCallback(() => {
		setIsOpen(true);
		setStep("awaiting_message");
		setMessages([createMessage("bot", CHAT_COPY.welcome)]);
		setIsSubmitting(false);
		userMessageRef.current = "";
		onOpen?.();
	}, [onOpen]);

	const close = useCallback(() => {
		setIsOpen(false);
	}, []);

	const toggle = useCallback(() => {
		if (isOpen) {
			close();
		} else {
			open();
		}
	}, [close, isOpen, open]);

	const submitContact = useCallback(async (message: string, email: string) => {
		const response = await fetch("/api/support/contact", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message, email }),
		});

		if (!response.ok) {
			throw new Error("submit_failed");
		}
	}, []);

	const sendMessage = useCallback(
		async (text: string) => {
			const trimmed = text.trim();
			if (!trimmed || isSubmitting || step === "completed") return;

			appendMessage("user", trimmed);

			if (step === "awaiting_message") {
				userMessageRef.current = trimmed;
				appendMessage("bot", CHAT_COPY.requestEmail);
				setStep("awaiting_email");
				return;
			}

			if (step === "awaiting_email") {
				if (!isValidEmail(trimmed)) {
					appendMessage("bot", CHAT_COPY.invalidEmail);
					return;
				}

				setIsSubmitting(true);
				try {
					await submitContact(userMessageRef.current, trimmed.trim());
					appendMessage("bot", CHAT_COPY.confirmation);
					setStep("completed");
				} catch {
					appendMessage("bot", CHAT_COPY.submitError);
				} finally {
					setIsSubmitting(false);
				}
			}
		},
		[appendMessage, isSubmitting, step, submitContact],
	);

	const composerDisabled = step === "completed" || isSubmitting;
	const composerPlaceholder =
		step === "awaiting_email"
			? "Digite seu e-mail..."
			: step === "completed"
				? "Conversa encerrada"
				: "Digite sua mensagem...";

	return {
		isOpen,
		step,
		messages,
		isSubmitting,
		composerDisabled,
		composerPlaceholder,
		open,
		close,
		toggle,
		sendMessage,
	};
}
