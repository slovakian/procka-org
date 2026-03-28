import alchemy from "alchemy";
import { Astro } from "alchemy/cloudflare";
import { GitHubComment } from "alchemy/github";
import { CloudflareStateStore } from "alchemy/state";

const stage = process.env.STAGE ?? "dev";

const app = await alchemy("procka-org", {
	stage,
	stateStore:
		process.env.NODE_ENV === "production" || process.env.CI
			? (scope) =>
					new CloudflareStateStore(scope, {
						stateToken: alchemy.secret(process.env.ALCHEMY_STATE_TOKEN),
					})
			: undefined, // Uses default FileSystemStateStore
});

const isProduction = stage === "prod";

export const worker = await Astro("website", {
	domains: isProduction ? ["procka.org"] : undefined,
	// Hybrid static + server: prerendered HTML is served from assets; Worker still handles
	// on-demand routes (Keystatic, APIs). Alchemy only defaults this path when output is "server".
	entrypoint: "dist/_worker.js/index.js",
});

console.log({
	url: worker.url,
});

if (process.env.PULL_REQUEST) {
	const previewUrl = worker.url;

	await GitHubComment("pr-preview-comment", {
		owner: process.env.GITHUB_REPOSITORY_OWNER || "slovakian",
		repository: process.env.GITHUB_REPOSITORY_NAME || "procka-org",
		issueNumber: Number(process.env.PULL_REQUEST),
		body: `
## 🚀 Preview Deployed

Your preview is ready!

**Preview URL:** ${previewUrl}

This preview was built from commit ${process.env.GITHUB_SHA}

---
<sub>🤖 This comment will be updated automatically when you push new commits to this PR.</sub>`,
	});
}

await app.finalize();
