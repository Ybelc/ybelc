"use client";

import { useEffect, useRef } from "react";

import type { ChatMessage } from "./use-chat-flow";

type Props = {
	messages: ChatMessage[];
};

export function ChatMessageList({ messages }: Props) {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	if (messages.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
			{messages.map((message) => (
				<div
					key={message.id}
					className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
				>
					<div
						className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
							message.role === "user"
								? "rounded-br-md bg-y-blue text-white"
								: "rounded-bl-md border border-y-line bg-y-surface text-y-fg shadow-sm"
						}`}
					>
						{message.body}
					</div>
				</div>
			))}
			<div ref={bottomRef} />
		</div>
	);
}
