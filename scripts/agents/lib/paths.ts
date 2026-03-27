import { existsSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";

export function findRepoRoot(fromDir: string): string {
	let dir = fromDir;
	for (;;) {
		if (existsSync(join(dir, "package.json"))) {
			return dir;
		}
		const parent = dirname(dir);
		if (parent === dir) {
			throw new Error("Could not find package.json (repo root)");
		}
		dir = parent;
	}
}

/** True if any path segment of `relToRoot` matches an ignore entry (exact segment name). */
export function pathHasIgnoredSegment(
	relToRoot: string,
	ignores: string[],
): boolean {
	if (!relToRoot || relToRoot === ".") {
		return false;
	}
	const norm = relToRoot.split(sep).join("/");
	const segments = norm.split("/").filter(Boolean);
	for (const seg of segments) {
		if (ignores.includes(seg)) {
			return true;
		}
	}
	return false;
}

export function posixRelative(fromRoot: string, absolute: string): string {
	return relative(fromRoot, absolute).split(sep).join("/");
}
