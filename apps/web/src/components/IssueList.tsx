import { Table } from "@mantine/core";
import type { Issue } from "../lib/issues";
import { IssueRow } from "./IssueRow";

type Props = {
	issues: Issue[];
	selectedId: string | undefined;
	onSelect: (id: string) => void;
};

export function IssueList({ issues, selectedId, onSelect }: Props) {
	return (
		<Table highlightOnHover verticalSpacing="sm">
			<Table.Thead>
				<Table.Tr>
					<Table.Th w={56} ta="right">
						#
					</Table.Th>
					<Table.Th>タイトル</Table.Th>
					<Table.Th w={132}>状態</Table.Th>
					<Table.Th w={96}>更新日</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{issues.map((issue, index) => (
					// 番号は並び順に振る行番号で、課題そのものの識別子ではない。
					<IssueRow
						key={issue.id}
						issue={issue}
						number={index + 1}
						selected={issue.id === selectedId}
						onSelect={onSelect}
					/>
				))}
			</Table.Tbody>
		</Table>
	);
}
