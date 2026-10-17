"use client";

import { ChatFab } from "./chat-fab";
import { ChatPanel } from "./chat-panel";
import { useChatFlow } from "./use-chat-flow";

export function ChatWidget() {
	const {
		isOpen,
		messages,
		isSubmitting,
		composerDisabled,
		composerPlaceholder,
		close,
		toggle,
		sendMessage,
	} = useChatFlow();

	return (
		<>
			<ChatPanel
				isOpen={isOpen}
				messages={messages}
				composerDisabled={composerDisabled}
				composerPlaceholder={composerPlaceholder}
				isSubmitting={isSubmitting}
				onClose={close}
				onSend={sendMessage}
			/>

			{!isOpen ? (
				<div className="fixed right-4 bottom-4 z-[61] md:right-6 md:bottom-6">
					<ChatFab isOpen={false} onClick={toggle} />
				</div>
			) : null}
		</>
	);
}
