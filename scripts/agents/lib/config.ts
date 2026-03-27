import { readFileSync } from "node:fs";
import { join } from "node:path";

const DEFAULT_CONTEXT_IGNORE = [
	"node_modules",
	".git",
	"dist",
	".astro",
	"coverage",
];

export type AgentsSyncConfig = {
	claudeAppend?: string;
	skillTargets: string[];
	contextIgnore?: string[];
	skillSyncClean?: boolean;
};

const DEFAULTS: AgentsSyncConfig = {
	claudeAppend: "",
	skillTargets: [".claude/skills"],
	contextIgnore: DEFAULT_CONTEXT_IGNORE,
	skillSyncClean: false,
};

export function loadConfig(repoRoot: string): AgentsSyncConfig {
	const path = join(repoRoot, "agents-sync.config.json");
	let parsed: Partial<AgentsSyncConfig> = {};
	try {
		const raw = readFileSync(path, "utf8");
		parsed = JSON.parse(raw) as Partial<AgentsSyncConfig>;
	} catch (e) {
		const err = e as NodeJS.ErrnoException;
		if (err.code !== "ENOENT") {
			throw e;
		}
	}

	const skillTargets =
		Array.isArray(parsed.skillTargets) && parsed.skillTargets.length > 0
			? parsed.skillTargets
			: DEFAULTS.skillTargets;

	const contextIgnore = [
		...new Set([
			...(DEFAULTS.contextIgnore ?? []),
			...(parsed.contextIgnore ?? []),
		]),
	];

	return {
		claudeAppend:
			typeof parsed.claudeAppend === "string"
				? parsed.claudeAppend
				: (DEFAULTS.claudeAppend ?? ""),
		skillTargets,
		contextIgnore,
		skillSyncClean:
			typeof parsed.skillSyncClean === "boolean"
				? parsed.skillSyncClean
				: (DEFAULTS.skillSyncClean ?? false),
	};
}
