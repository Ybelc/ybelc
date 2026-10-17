import "@Ybelc-Page/env/load-root-env";
import "@Ybelc-Page/env/web";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const monorepoRoot = resolve(
	dirname(fileURLToPath(import.meta.url)),
	"../..",
);

const nextConfig: NextConfig = {
	reactCompiler: true,
	turbopack: {
		root: monorepoRoot,
	},
	outputFileTracingRoot: monorepoRoot,
};

export default nextConfig;
