import { Table, Text, UnstyledButton } from "@mantine/core";
import { formatRelative } from "../lib/datetime";
import type { Issue } from "../lib/issues";
import classes from "../styles/IssueRow.module.css";
import { StatusPill } from "./StatusPill";

type Props = {
	issue: Issue;
	number: number;
	selected: boolean;
	onSelect: (id: string) => void;
};

export function IssueRow({ issue, number, selected, onSelect }: Props) {
	const select = () => {
		onSelect(issue.id);
	};

	return (
		// 行のどこを押しても選べるようにする。キーボードは題名のボタンが受け持つ。
		<Table.Tr
			className={classes.row}
			data-selected={selected ? "" : undefined}
			onClick={select}
		>
			<Table.Td ta="right" c="dimmed" fz="sm" className={classes.number}>
				{number}
			</Table.Td>

			<Table.Td>
				<UnstyledButton
					className={classes.title}
					onClick={(event) => {
						// 行の onClick と二重に発火させない。
						event.stopPropagation();
						select();
					}}
				>
					<Text fw={500}>{issue.title}</Text>
				</UnstyledButton>
				{issue.description !== "" && (
					<Text size="sm" c="dimmed" lineClamp={1}>
						{issue.description}
					</Text>
				)}
			</Table.Td>

			<Table.Td>
				<StatusPill status={issue.status} />
			</Table.Td>

			<Table.Td>
				<Text size="sm" c="dimmed" className={classes.time}>
					{formatRelative(issue.updatedAt)}
				</Text>
			</Table.Td>
		</Table.Tr>
	);
}
