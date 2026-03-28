import {
	Item,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@/components/ui/item";

export type ProjectItemProps = {
	title: string;
	description: string;
	href?: string;
};

export function ProjectItem({
	title,
	description,
	href = "https://google.com",
}: ProjectItemProps) {
	return (
		<Item
			variant="outline"
			// biome-ignore lint/a11y/useAnchorContent: Item merges ItemContent into the anchor via useRender
			render={<a href={href} />}
		>
			<ItemContent>
				<ItemTitle>{title}</ItemTitle>
				<ItemDescription>{description}</ItemDescription>
			</ItemContent>
		</Item>
	);
}
