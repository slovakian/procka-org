import { collection, config, fields } from "@keystatic/core";

const isProduction = process.env.STAGE === "prod";

export default config({
	storage: isProduction
		? {
				kind: "github",
				repo: "slovakian/procka-org",
			}
		: {
				kind: "local",
			},

	collections: {
		journal: collection({
			label: "Journal",
			slugField: "title",
			path: "src/content/journal/*",
			format: { contentField: "content" },
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				content: fields.mdx({
					label: "Content",
					extension: "md",
				}),
			},
		}),
	},
});
