import { PortfolioValidationError } from "./local-store";

/**
 * O painel de portfólio grava em arquivos do repositório, então só existe em desenvolvimento.
 * Em produção as rotas respondem 404 — o gerenciamento passa a ser feito pela API/backend.
 */
export function isPortfolioAdminEnabled() {
	return process.env.NODE_ENV === "development";
}

export function adminGuard(request: Request): Response | null {
	if (!isPortfolioAdminEnabled()) {
		return Response.json({ error: "Não encontrado" }, { status: 404 });
	}
	// Bloqueia requisições de outras origens (CSRF) enquanto o servidor de dev estiver rodando.
	if (request.method !== "GET") {
		const origin = request.headers.get("origin");
		const host = request.headers.get("host");
		if (origin && host && new URL(origin).host !== host) {
			return Response.json({ error: "Origem não permitida" }, { status: 403 });
		}
	}
	return null;
}

export function adminErrorResponse(error: unknown) {
	if (error instanceof PortfolioValidationError) {
		return Response.json(
			{ error: error.message, issues: error.issues },
			{ status: 422 },
		);
	}
	if (error instanceof SyntaxError) {
		return Response.json({ error: "JSON inválido" }, { status: 400 });
	}
	console.error("[portfolio-admin]", error);
	return Response.json({ error: "Erro ao salvar" }, { status: 500 });
}
