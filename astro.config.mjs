import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";
import alchemy from "alchemy/cloudflare/astro";
import { defineConfig } from "astro/config";

// https://astro.build/config
// When you add Keystatic fields that use Markdoc, install `@astrojs/markdoc` (Astro 6+) or a
// Markdoc build compatible with your Astro major, then add `markdoc()` to integrations.
export default defineConfig({
	output: "server",
	adapter: alchemy(),
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [react(), keystatic()],
});
