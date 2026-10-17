import { Logo } from "@/components/brand/logo";
import { HeaderShell } from "@/components/layout/header-shell";
import { hasPublishedPosts } from "@/lib/blog";
import { getNavLinks } from "@/lib/site-config";

export async function SiteHeader() {
	const showBlog = await hasPublishedPosts();
	const links = getNavLinks(showBlog);

	return <HeaderShell links={links} logo={<Logo href="/#inicio" priority />} />;
}
