import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { generateHTML } from "@tiptap/html/server";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "isomorphic-dompurify";

const extensions = [
	StarterKit,
	Link.configure({
		openOnClick: false,
		HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
	}),
	Image,
];

export function renderBlogHtml(content: Record<string, unknown>): string {
	try {
		const html = generateHTML(content, extensions);
		return DOMPurify.sanitize(html, {
			USE_PROFILES: { html: true },
			ADD_ATTR: ["target", "rel"],
		});
	} catch {
		return "";
	}
}
