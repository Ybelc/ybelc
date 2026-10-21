import { adminErrorResponse, adminGuard } from "@/lib/portfolio/admin-guard";
import {
	createLocalProject,
	readLocalProjects,
} from "@/lib/portfolio/local-store";
import { sortProjects } from "@/lib/portfolio/schema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const blocked = adminGuard(request);
	if (blocked) return blocked;
	return Response.json({ items: sortProjects(await readLocalProjects()) });
}

export async function POST(request: Request) {
	const blocked = adminGuard(request);
	if (blocked) return blocked;
	try {
		const body = await request.json();
		const project = await createLocalProject(body);
		return Response.json(project, { status: 201 });
	} catch (error) {
		return adminErrorResponse(error);
	}
}
