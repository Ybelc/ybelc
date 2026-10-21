import { env } from "@Ybelc-Page/env/web";

/**
 * Configuração central da marca Ybelc.
 *
 * Dados de contato e redes sociais ficam vazios até serem confirmados.
 * Campos vazios são ocultados automaticamente no header, rodapé, JSON-LD e CTA.
 */
export const siteConfig = {
	name: "Ybelc",
	legalName: "Ybelc",
	tagline: "Engenharia de software, IoT, automação e segurança integradas.",
	description:
		"A Ybelc desenvolve software sob medida, automação residencial e comercial, soluções de Internet das Coisas e segurança tecnológica — integrados em um único ecossistema inteligente.",
	url: env.NEXT_PUBLIC_SITE_URL ?? "https://ybelc.com.br",
	/** Mantido por compatibilidade (link "Acessar" do projeto-base). Não exibido na home. */
	accessUrl: env.NEXT_PUBLIC_ACCESS_APP_URL ?? "#contato",
	api: env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
	logo: {
		src: "/brand/ybelc-logo.png",
		width: 200,
		height: 200,
		alt: "Logo Ybelc",
	},
	ogImage: "/brand/og-image.png",
	contact: {
		// TODO(Ybelc): preencher com os dados oficiais.
		email: "",
		phone: "",
		location: "",
	},
	social: [] as { label: "LinkedIn" | "Instagram" | "YouTube" | "GitHub"; href: string }[],
};

export function hasContactInfo() {
	const { email, phone, location } = siteConfig.contact;
	return Boolean(email || phone || location);
}

export type NavLink = { href: string; label: string };

export const baseNavLinks: NavLink[] = [
	{ href: "/#solucoes", label: "Soluções" },
	{ href: "/#ecossistema", label: "Ecossistema" },
	{ href: "/#diferenciais", label: "Diferenciais" },
	{ href: "/#contato", label: "Contato" },
];

/** @deprecated Prefer getNavLinks(showBlog) */
export const navLinks = baseNavLinks;

const portfolioNavLink: NavLink = { href: "/#portfolio", label: "Portfólio" };

/** Insere "Portfólio" logo após "Soluções" quando houver projetos publicados. */
function withPortfolio(links: NavLink[], showPortfolio: boolean): NavLink[] {
	if (!showPortfolio) return links;
	const i = links.findIndex((l) => l.href === "/#solucoes");
	return [...links.slice(0, i + 1), portfolioNavLink, ...links.slice(i + 1)];
}

export function getNavLinks(showBlog: boolean, showPortfolio = false): NavLink[] {
	const links = withPortfolio(baseNavLinks, showPortfolio);
	if (!showBlog) return links;
	return [...links, { href: "/blog", label: "Blog" }];
}

/* -------------------------------------------------------------------------- */
/*                                   Hero                                     */
/* -------------------------------------------------------------------------- */

export const hero = {
	eyebrow: "Software · Automação · IoT · Segurança",
	title: "Tecnologia que conecta sistemas, espaços e pessoas.",
	highlight: "conecta",
	subtitle:
		"Transformamos necessidades reais em soluções digitais e inteligentes: do software sob medida aos dispositivos conectados, com automação e segurança pensadas desde o início.",
	primaryCta: "Solicitar um projeto",
	secondaryCta: { label: "Explorar soluções", href: "#solucoes" },
} as const;

/* -------------------------------------------------------------------------- */
/*                                 Soluções                                   */
/* -------------------------------------------------------------------------- */

export type SolutionArea = "software" | "automacao" | "iot" | "seguranca";

export type Solution = {
	id: SolutionArea;
	code: string;
	title: string;
	description: string;
	benefit: string;
	capabilities: string[];
};

export const solutions = {
	eyebrow: "Áreas de atuação",
	heading: "Soluções integradas, do código ao dispositivo.",
	subheading:
		"Quatro frentes complementares que podem atuar sozinhas ou em conjunto, conforme o desafio de cada projeto.",
	items: [
		{
			id: "software",
			code: "01",
			title: "Desenvolvimento de software e sistemas",
			description:
				"Aplicações web e mobile, sistemas personalizados e plataformas digitais construídas para o processo real da sua empresa.",
			benefit: "Software que se adapta ao seu negócio — não o contrário.",
			capabilities: [
				"Aplicações web e mobile",
				"Sistemas personalizados para empresas",
				"APIs, integrações e automação de processos",
				"Plataformas digitais, dashboards e sistemas de gestão",
				"Arquitetura de software e soluções escaláveis",
			],
		},
		{
			id: "automacao",
			code: "02",
			title: "Casa inteligente e automação",
			description:
				"Automação residencial e comercial que integra iluminação, dispositivos e ambientes em um controle centralizado.",
			benefit: "Mais conforto, eficiência e praticidade no dia a dia.",
			capabilities: [
				"Automação residencial e comercial",
				"Controle inteligente de iluminação, dispositivos e ambientes",
				"Integração de sensores e equipamentos conectados",
				"Monitoramento e controle centralizado",
			],
		},
		{
			id: "iot",
			code: "03",
			title: "Internet das Coisas (IoT)",
			description:
				"Dispositivos conectados, sensores e coleta de dados integrados a software e serviços em nuvem.",
			benefit: "Dados do mundo físico transformados em decisões.",
			capabilities: [
				"Dispositivos conectados e comunicação entre equipamentos",
				"Monitoramento de sensores e coleta de dados",
				"Integração entre hardware, software e nuvem",
				"Painéis de monitoramento em tempo real, quando aplicável",
				"Soluções para residências, empresas e ambientes industriais",
			],
		},
		{
			id: "seguranca",
			code: "04",
			title: "Segurança e proteção tecnológica",
			description:
				"Segurança de sistemas e aplicações aliada ao monitoramento inteligente de ambientes e ao controle de acesso.",
			benefit: "Proteção digital e física trabalhando juntas.",
			capabilities: [
				"Segurança de sistemas e aplicações",
				"Monitoramento inteligente de ambientes",
				"Integração de dispositivos e sensores de segurança",
				"Controle de acesso e automação de mecanismos de proteção",
				"Boas práticas de cibersegurança e proteção de dados",
			],
		},
	] satisfies Solution[],
};

export const solutionLabels: Record<SolutionArea | "geral", string> = {
	software: "Software e sistemas",
	automacao: "Casa inteligente e automação",
	iot: "Internet das Coisas (IoT)",
	seguranca: "Segurança tecnológica",
	geral: "Ainda não sei / Projeto integrado",
};

/* -------------------------------------------------------------------------- */
/*                                 Portfólio                                  */
/* -------------------------------------------------------------------------- */

export const portfolio = {
	eyebrow: "Portfólio · Laboratório Ybelc",
	heading: "Projetos que saem do papel e entram em operação.",
	subheading:
		"Sistemas, aplicações, dispositivos conectados e experimentos digitais desenvolvidos pela Ybelc. Passe o cursor — ou toque — para explorar cada projeto.",
	allLabel: "Ver portfólio completo",
} as const;

/* -------------------------------------------------------------------------- */
/*                           Ecossistema integrado                            */
/* -------------------------------------------------------------------------- */

export const ecosystem = {
	eyebrow: "Integração tecnológica",
	heading: "Um ecossistema, não peças soltas.",
	subheading:
		"Software, dispositivos, automação e segurança projetados para conversar entre si. Cada camada entrega valor sozinha — e muito mais quando trabalham juntas.",
	layers: [
		{
			id: "dispositivos",
			label: "Dispositivos e sensores",
			detail: "Sensores, atuadores, câmeras e equipamentos conectados captam o que acontece no ambiente.",
		},
		{
			id: "conectividade",
			label: "Conectividade IoT",
			detail: "Comunicação entre equipamentos e envio de dados para a camada de software.",
		},
		{
			id: "software",
			label: "Software e nuvem",
			detail: "Regras de negócio, APIs e integrações processam os dados e coordenam as ações.",
		},
		{
			id: "controle",
			label: "Painéis e automação",
			detail: "Aplicativos, dashboards e rotinas automáticas colocam o controle nas mãos certas.",
		},
	],
	security: "Segurança aplicada em todas as camadas: acesso, dados, dispositivos e aplicações.",
	exampleTitle: "Exemplo de cenário",
	exampleNote: "Ilustração de como as camadas podem se integrar em um projeto.",
	example: [
		"Um sensor identifica a abertura de uma porta fora do horário previsto.",
		"A regra de automação acende a iluminação do ambiente.",
		"O sistema registra o evento e notifica o responsável no aplicativo.",
		"O histórico fica disponível no painel para consulta.",
	],
} as const;

/* -------------------------------------------------------------------------- */
/*                                Diferenciais                                */
/* -------------------------------------------------------------------------- */

export const differentials = {
	eyebrow: "Por que a Ybelc",
	heading: "Engenharia orientada ao problema.",
	subheading:
		"Começamos pelo desafio, não pela ferramenta. A tecnologia certa é a que resolve — e continua resolvendo à medida que você cresce.",
	items: [
		{
			icon: "target",
			title: "Foco na resolução de problemas",
			description: "Entendemos o contexto antes de propor a solução, para que cada entrega tenha propósito claro.",
		},
		{
			icon: "puzzle",
			title: "Soluções personalizadas",
			description: "Projetos desenhados para a sua realidade, sem pacotes genéricos que não se encaixam.",
		},
		{
			icon: "network",
			title: "Integração de ponta a ponta",
			description: "Software, hardware e serviços em nuvem pensados para funcionar como um só sistema.",
		},
		{
			icon: "scale",
			title: "Arquitetura escalável",
			description: "Bases técnicas preparadas para evoluir com novas funcionalidades, usuários e dispositivos.",
		},
		{
			icon: "shield",
			title: "Segurança desde o projeto",
			description: "Boas práticas de proteção de dados e controle de acesso consideradas desde a primeira linha.",
		},
		{
			icon: "gauge",
			title: "Eficiência operacional",
			description: "Automação de processos e ambientes para reduzir tarefas manuais e ganhar tempo.",
		},
	],
} as const;

/* -------------------------------------------------------------------------- */
/*                                   CTA                                      */
/* -------------------------------------------------------------------------- */

export const finalCta = {
	eyebrow: "Vamos construir juntos",
	heading: "Tem um projeto em mente?",
	subheading:
		"Conte o que você precisa — um sistema, uma automação, um projeto de IoT ou de segurança. Avaliamos o cenário e indicamos o melhor caminho.",
	primary: "Solicitar um projeto",
} as const;

/* -------------------------------------------------------------------------- */
/*                                  Rodapé                                    */
/* -------------------------------------------------------------------------- */

export const baseFooterQuickLinks: NavLink[] = [
	{ href: "/#inicio", label: "Início" },
	{ href: "/#solucoes", label: "Soluções" },
	{ href: "/#ecossistema", label: "Ecossistema" },
	{ href: "/#diferenciais", label: "Diferenciais" },
	{ href: "/#contato", label: "Contato" },
];

/** @deprecated Prefer getFooterQuickLinks(showBlog) */
export const footerQuickLinks = baseFooterQuickLinks;

export function getFooterQuickLinks(showBlog: boolean, showPortfolio = false): NavLink[] {
	const links = withPortfolio(baseFooterQuickLinks, showPortfolio);
	if (!showBlog) return links;
	return [...links, { href: "/blog", label: "Blog" }];
}
