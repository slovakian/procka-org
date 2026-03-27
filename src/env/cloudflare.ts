// Auto-generated Cloudflare binding types.
// @see https://alchemy.run/concepts/bindings/#type-safe-bindings

import { env as cloudflareEnv } from "cloudflare:workers";
import type { worker } from "../../alchemy.run";

export type CloudflareEnv = typeof worker.Env;

export const env = cloudflareEnv;
