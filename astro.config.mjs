import markdoc from "@astrojs/markdoc";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import alchemy from "alchemy/cloudflare/astro";
import { defineConfig } from "astro/config";

// import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
	output: "static",
	// prefetch: {
	// 	prefetchAll: true,
	// 	defaultStrategy: "hover",
	// },
	adapter: alchemy(),
	imageService: "compile",
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [react(), markdoc()],
});
