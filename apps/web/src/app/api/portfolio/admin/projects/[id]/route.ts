import { adminErrorResponse, adminGuard } from "@/lib/portfolio/admin-guard";
import {
	deleteLocalProject,
	updateLocalProject,
} from "@/lib/portfolio/local-store";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Ctx) {
	const blocked = adminGuard(request);
	if (blocked) return blocked;
	const { id } = await params;
	try {
		const project = await updateLocalProject(id, await request.json());
		if (!project)
			return Response.json(
				{ error: "Projeto não encontrado" },
				{ status: 404 },
			);
		return Response.json(project);
	} catch (error) {
		return adminErrorResponse(error);
	}
}

export async function DELETE(request: Request, { params }: Ctx) {
	const blocked = adminGuard(request);
	if (blocked) return blocked;
	const { id } = await params;
	const ok = await deleteLocalProject(id);
	return ok
		? new Response(null, { status: 204 })
		: Response.json({ error: "Projeto não encontrado" }, { status: 404 });
}
