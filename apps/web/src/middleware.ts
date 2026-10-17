import { NextResponse, type NextRequest } from "next/server";

import { siteConfig } from "@/lib/site-config";

function apiBase(): string {
	const base = siteConfig.api.replace(/\/$/, "");
	return base.endsWith("/api/v1") ? base : `${base}/api/v1`;
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const match = pathname.match(/^\/blog\/([^/]+)\/?$/);
	if (!match) {
		return NextResponse.next();
	}

	const slug = decodeURIComponent(match[1]);
	if (slug === "") {
		return NextResponse.next();
	}

	try {
		const res = await fetch(
			`${apiBase()}/blog/posts/${encodeURIComponent(slug)}`,
			{
				headers: { Accept: "application/json" },
				cache: "no-store",
			},
		);
		if (res.status === 410) {
			return new NextResponse("Gone", {
				status: 410,
				headers: {
					"Content-Type": "text/plain; charset=utf-8",
					"X-Robots-Tag": "noindex, nofollow",
				},
			});
		}
	} catch {
		// If API is unreachable, let the page handle the fallback.
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/blog/:slug*"],
};
