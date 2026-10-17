import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";
import { siteConfig } from "@/lib/site-config";

const spaceGrotesk = Space_Grotesk({
	variable: "--font-space-grotesk",
	subsets: ["latin"],
	weight: ["500", "600", "700"],
	display: "swap",
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

const jetbrains = JetBrains_Mono({
	variable: "--font-jetbrains",
	subsets: ["latin"],
	weight: ["400", "500"],
	display: "swap",
});

const title = "Ybelc | Software, IoT, automação e segurança";

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: title,
		template: "%s | Ybelc",
	},
	description: siteConfig.description,
	keywords: [
		"desenvolvimento de software",
		"sistemas personalizados",
		"aplicativos web e mobile",
		"automação residencial",
		"casa inteligente",
		"Internet das Coisas",
		"IoT",
		"segurança eletrônica",
		"cibersegurança",
		"Ybelc",
	],
	applicationName: siteConfig.name,
	authors: [{ name: siteConfig.name }],
	creator: siteConfig.name,
	openGraph: {
		type: "website",
		locale: "pt_BR",
		url: siteConfig.url,
		siteName: siteConfig.name,
		title,
		description: siteConfig.description,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				alt: "Ybelc — software, IoT, automação e segurança integrados",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title,
		description: siteConfig.description,
		images: [siteConfig.ogImage],
	},
	robots: {
		index: true,
		follow: true,
	},
	alternates: {
		canonical: "/",
	},
};

export const viewport: Viewport = {
	themeColor: "#050a30",
	colorScheme: "dark",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" className="dark" suppressHydrationWarning>
			<body
				className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} bg-y-navy font-body text-y-fg antialiased`}
			>
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-y-blue focus:px-4 focus:py-2 focus:text-white"
				>
					Pular para o conteúdo
				</a>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
