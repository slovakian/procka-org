import { ProjectItem, type ProjectItemProps } from "@/components/ProjectItem";
import { ItemGroup } from "@/components/ui/item";

type ProjectsListProps = {
	items: ProjectItemProps[];
};

export function ProjectsList({ items }: ProjectsListProps) {
	return (
		<ItemGroup>
			{items.map((item) => (
				<ProjectItem key={item.title} {...item} />
			))}
		</ItemGroup>
	);
}
