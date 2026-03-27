import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./lib/config.ts";
import {
	findRepoRoot,
	pathHasIgnoredSegment,
	posixRelative,
} from "./lib/paths.ts";

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = findRepoRoot(scriptDir);
const config = loadConfig(repoRoot);

function buildClaudeBody(): string {
	const append = config.claudeAppend?.trimEnd() ?? "";
	if (append.length > 0) {
		return `@AGENTS.md\n\n${append}\n`;
	}
	return "@AGENTS.md\n";
}

function walkDir(absDir: string, relFromRoot: string): void {
	if (pathHasIgnoredSegment(relFromRoot, config.contextIgnore ?? [])) {
		return;
	}

	let entries: ReturnType<typeof readdirSync>;
	try {
		entries = readdirSync(absDir, { withFileTypes: true });
	} catch {
		return;
	}

	for (const ent of entries) {
		const name = ent.name;
		const childRel =
			relFromRoot === "" || relFromRoot === "."
				? name
				: `${relFromRoot}/${name}`;
		const childAbs = join(absDir, name);

		if (ent.isDirectory()) {
			if (pathHasIgnoredSegment(childRel, config.contextIgnore ?? [])) {
				continue;
			}
			walkDir(childAbs, childRel);
			continue;
		}

		if (!ent.isFile() || name !== "AGENTS.md") {
			continue;
		}

		if (pathHasIgnoredSegment(childRel, config.contextIgnore ?? [])) {
			continue;
		}

		const dir = absDir;
		const claudePath = join(dir, "CLAUDE.md");
		const body = buildClaudeBody();
		writeFileSync(claudePath, body, "utf8");
		const rel = posixRelative(repoRoot, claudePath);
		console.log(`wrote ${rel}`);
	}
}

walkDir(repoRoot, "");
console.log("agents:sync-context done");
