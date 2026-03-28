import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import alchemy from "alchemy/cloudflare/astro";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
	output: "static",
	fonts: [
		{
			name: "Geist Mono",
			cssVariable: "--font-mono",
			provider: fontProviders.fontsource(),
			weights: ["100 900"],
			fallbacks: ["monospace"],
			subsets: ["latin", "latin-ext", "cyrillic"],
		},
	],
	adapter: alchemy(),
	imageService: "compile",
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [react(), mdx()],
});
