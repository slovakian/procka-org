import { createEnv } from "@t3-oss/env-core";
// import { z } from "zod";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {},
	// biome-ignore lint/suspicious/noExplicitAny: Needed for use in validated env definition
	runtimeEnv: (import.meta as any).env,
	emptyStringAsUndefined: true,
});
