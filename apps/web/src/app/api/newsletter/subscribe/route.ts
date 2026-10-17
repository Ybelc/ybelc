import { env } from "@Ybelc-Page/env/web";
import { z } from "zod";

const subscribeSchema = z.object({
	email: z.string().email(),
});

const NEWSLETTER_SUBSCRIBE_PATH = "/coming-soon/subscribe";

export async function POST(request: Request) {
	const apiUrl = env.NEXT_PUBLIC_API_URL;
	if (!apiUrl) {
		return Response.json(
			{ error: "API não configurada. Defina NEXT_PUBLIC_API_URL no .env." },
			{ status: 503 },
		);
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "Corpo da requisição inválido." }, { status: 400 });
	}

	const parsed = subscribeSchema.safeParse(body);
	if (!parsed.success) {
		return Response.json({ error: "E-mail inválido." }, { status: 400 });
	}

	const upstream = await fetch(`${apiUrl}${NEWSLETTER_SUBSCRIBE_PATH}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email: parsed.data.email }),
	});

	if (!upstream.ok) {
		return Response.json(
			{ error: "Não foi possível concluir o cadastro." },
			{ status: upstream.status },
		);
	}

	return Response.json({ success: true });
}
