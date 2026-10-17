"use client";

import { Toaster } from "@Ybelc-Page/ui/components/sonner";

import { ChatWidget } from "@/components/chat-widget/chat-widget";
import { ContactDialogProvider } from "@/components/contact/contact-dialog-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ContactDialogProvider>
			{children}
			<ChatWidget />
			<Toaster richColors theme="dark" position="top-center" />
		</ContactDialogProvider>
	);
}
