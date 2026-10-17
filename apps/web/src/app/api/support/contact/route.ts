import { env } from "@Ybelc-Page/env/web";
import { z } from "zod";

const contactSchema = z.object({
	message: z.string().min(1).max(5000),
	email: z.string().email(),
});

const PUBLIC_SUPPORT_CONTACT_PATH = "/public/support/contact";

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

	const parsed = contactSchema.safeParse(body);
	if (!parsed.success) {
		return Response.json({ error: "Dados inválidos." }, { status: 400 });
	}

	const upstream = await fetch(`${apiUrl}${PUBLIC_SUPPORT_CONTACT_PATH}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			message: parsed.data.message,
			email: parsed.data.email,
		}),
	});

	if (!upstream.ok) {
		return Response.json(
			{ error: "Não foi possível enviar sua solicitação." },
			{ status: upstream.status },
		);
	}

	return Response.json({ success: true }, { status: 201 });
}
