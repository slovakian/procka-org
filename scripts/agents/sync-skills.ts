import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { cp } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./lib/config.ts";
import { findRepoRoot } from "./lib/paths.ts";

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = findRepoRoot(scriptDir);
const config = loadConfig(repoRoot);

const cleanFlag =
	process.argv.includes("--clean") || config.skillSyncClean === true;

const SOURCE_SKILLS = join(repoRoot, ".agents", "skills");

function listSkillDirs(): string[] {
	if (!existsSync(SOURCE_SKILLS)) {
		return [];
	}
	const names: string[] = [];
	for (const name of readdirSync(SOURCE_SKILLS, { withFileTypes: true })) {
		if (!name.isDirectory()) {
			continue;
		}
		const skillPath = join(SOURCE_SKILLS, name.name);
		if (!existsSync(join(skillPath, "SKILL.md"))) {
			continue;
		}
		names.push(name.name);
	}
	return names.sort();
}

async function syncTarget(
	targetRel: string,
	skillNames: string[],
): Promise<void> {
	const targetRoot = join(repoRoot, targetRel);
	mkdirSync(targetRoot, { recursive: true });

	for (const name of skillNames) {
		const from = join(SOURCE_SKILLS, name);
		const to = join(targetRoot, name);
		await cp(from, to, { recursive: true, force: true });
		console.log(`synced skill ${name} -> ${targetRel}/${name}`);
	}

	if (cleanFlag && existsSync(targetRoot)) {
		const allowed = new Set(skillNames);
		for (const ent of readdirSync(targetRoot, { withFileTypes: true })) {
			if (!ent.isDirectory()) {
				continue;
			}
			if (allowed.has(ent.name)) {
				continue;
			}
			const p = join(targetRoot, ent.name);
			const skillMd = join(p, "SKILL.md");
			if (existsSync(skillMd)) {
				rmSync(p, { recursive: true, force: true });
				console.log(`removed orphan ${targetRel}/${ent.name}`);
			}
		}
	}
}

const skillNames = listSkillDirs();

if (skillNames.length === 0) {
	if (!existsSync(SOURCE_SKILLS)) {
		console.log("agents:sync-skills: no .agents/skills directory, skipping");
	} else {
		console.log("agents:sync-skills: no skill folders with SKILL.md, skipping");
	}
} else {
	for (const target of config.skillTargets) {
		const abs = join(repoRoot, target);
		try {
			if (existsSync(abs) && !statSync(abs).isDirectory()) {
				console.error(`agents:sync-skills: not a directory: ${target}`);
				process.exitCode = 1;
				continue;
			}
		} catch {
			console.error(`agents:sync-skills: cannot stat ${target}`);
			process.exitCode = 1;
			continue;
		}
		await syncTarget(target, skillNames);
	}
}

console.log("agents:sync-skills done");
