import { adminErrorResponse, adminGuard } from "@/lib/portfolio/admin-guard";
import { saveUpload } from "@/lib/portfolio/local-store";

export const dynamic = "force-dynamic";

/** Recebe um arquivo (multipart, campo "file") e salva em public/portfolio/uploads. */
export async function POST(request: Request) {
	const blocked = adminGuard(request);
	if (blocked) return blocked;
	try {
		const form = await request.formData();
		const file = form.get("file");
		if (!(file instanceof File))
			return Response.json(
				{ error: "Envie um arquivo no campo 'file'" },
				{ status: 400 },
			);
		return Response.json(await saveUpload(file), { status: 201 });
	} catch (error) {
		return adminErrorResponse(error);
	}
}
