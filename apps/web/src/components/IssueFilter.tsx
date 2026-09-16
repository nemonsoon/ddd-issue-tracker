import { SegmentedControl } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import type { IssueStatus } from "../lib/issues";
import { isIssueStatus } from "../lib/issues";

export type IssueCounts = {
	all: number;
	open: number;
	closed: number;
};

// 「絞り込みなし」を表す値。search param からは外すため、URL には出ない。
const ALL = "all";

type Props = {
	counts: IssueCounts;
	activeStatus: IssueStatus | undefined;
};

export function IssueFilter({ counts, activeStatus }: Props) {
	const navigate = useNavigate({ from: "/" });

	return (
		<SegmentedControl
			value={activeStatus ?? ALL}
			onChange={(value) => {
				// selected を引き継がないことで、絞り込みを変えたときに選択が外れる。
				// 選んだ課題が一覧から消えたのに詳細だけ残る状態を作らないため。
				void navigate({
					to: "/",
					search: isIssueStatus(value) ? { status: value } : {},
				});
			}}
			data={[
				{ value: ALL, label: `すべて ${counts.all}` },
				{ value: "open", label: `Open ${counts.open}` },
				{ value: "closed", label: `Closed ${counts.closed}` },
			]}
		/>
	);
}
