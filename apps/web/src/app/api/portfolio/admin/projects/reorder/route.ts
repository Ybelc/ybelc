import { z } from "zod";

import { adminErrorResponse, adminGuard } from "@/lib/portfolio/admin-guard";
import { reorderLocalProjects } from "@/lib/portfolio/local-store";
import { sortProjects } from "@/lib/portfolio/schema";

export const dynamic = "force-dynamic";

const bodySchema = z.object({ ids: z.array(z.string().min(1)).min(1) });

export async function POST(request: Request) {
	const blocked = adminGuard(request);
	if (blocked) return blocked;
	try {
		const parsed = bodySchema.safeParse(await request.json());
		if (!parsed.success)
			return Response.json({ error: "Lista de ids inválida" }, { status: 400 });
		const items = await reorderLocalProjects(parsed.data.ids);
		return Response.json({ items: sortProjects(items) });
	} catch (error) {
		return adminErrorResponse(error);
	}
}
