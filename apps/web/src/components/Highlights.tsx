import { Text, Title } from "@mantine/core";
import { Circle, Target } from "lucide-react";
import { FOCUS_ITEM_COUNT, ICON_SIZE, ICON_STROKE } from "../constants";
import { formatRelative } from "../lib/datetime";
import type { Issue } from "../lib/issues";
import classes from "../styles/Highlights.module.css";
import { IssueDetail } from "./IssueDetail";

type Props = {
	issues: Issue[];
	selected: Issue | undefined;
	onClearSelection: () => void;
};

// 課題を選んでいないときは今週の注目事項、選んだらその詳細。
// 一覧を眺めるときと1件に入ったときで、見たいものが切り替わるため同じ場所を使う。
export function Highlights({ issues, selected, onClearSelection }: Props) {
	return (
		<section className={classes.panel}>
			{selected === undefined ? (
				<FocusList issues={issues} />
			) : (
				<IssueDetail issue={selected} onClose={onClearSelection} />
			)}
		</section>
	);
}

function FocusList({ issues }: { issues: Issue[] }) {
	// ISO 8601 の文字列は辞書順が時刻順と一致する。古い未完了から順に拾う。
	const focus = issues
		.filter((issue) => issue.status === "open")
		.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
		.slice(0, FOCUS_ITEM_COUNT);

	return (
		<div>
			<Title order={2} size="h4" mb="sm" className={classes.heading}>
				<Target
					size={ICON_SIZE.sm}
					strokeWidth={ICON_STROKE}
					aria-hidden="true"
				/>
				Focus this week
			</Title>

			{focus.length === 0 ? (
				<Text size="sm" c="dimmed">
					未完了の課題はありません。
				</Text>
			) : (
				<ul className={classes.focusList}>
					{focus.map((issue) => (
						<li key={issue.id} className={classes.focusItem}>
							<Circle
								className={classes.check}
								size={ICON_SIZE.md}
								strokeWidth={ICON_STROKE}
								aria-hidden="true"
							/>
							<div>
								<Text size="sm" fw={500}>
									{issue.title}
								</Text>
								<Text size="xs" c="dimmed" className={classes.tabular}>
									{formatRelative(issue.createdAt)}に作成
								</Text>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
