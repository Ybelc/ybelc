import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const monorepoRoot = resolve(
	dirname(fileURLToPath(import.meta.url)),
	"../../..",
);

function loadEnvFile(filename: string) {
	const path = resolve(monorepoRoot, filename);
	if (existsSync(path)) {
		config({ path, quiet: true });
	}
}

const nodeEnv = process.env.NODE_ENV ?? "development";

loadEnvFile(".env");
loadEnvFile(".env.local");
loadEnvFile(`.env.${nodeEnv}`);
loadEnvFile(`.env.${nodeEnv}.local`);
