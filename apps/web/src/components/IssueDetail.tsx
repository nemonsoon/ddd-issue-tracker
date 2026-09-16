import { CloseButton, Text, Title } from "@mantine/core";
import { CalendarPlus, Hash, RefreshCw } from "lucide-react";
import { ICON_SIZE, ICON_STROKE } from "../constants";
import { formatAbsolute } from "../lib/datetime";
import type { Issue } from "../lib/issues";
import classes from "../styles/IssueDetail.module.css";
import { StatusPill } from "./StatusPill";

type Props = {
	issue: Issue;
	onClose: () => void;
};

export function IssueDetail({ issue, onClose }: Props) {
	return (
		<div>
			<div className={classes.head}>
				<Title order={3} size="h5">
					{issue.title}
				</Title>
				<CloseButton onClick={onClose} aria-label="詳細を閉じる" />
			</div>

			<div className={classes.status}>
				<StatusPill status={issue.status} />
			</div>

			<Text
				size="sm"
				c={issue.description === "" ? "dimmed" : undefined}
				className={classes.description}
			>
				{issue.description === ""
					? "説明は登録されていません。"
					: issue.description}
			</Text>

			<dl className={classes.meta}>
				<div className={classes.metaItem}>
					<dt>
						<CalendarPlus
							size={ICON_SIZE.sm}
							strokeWidth={ICON_STROKE}
							aria-hidden="true"
						/>
						作成
					</dt>
					<dd>{formatAbsolute(issue.createdAt)}</dd>
				</div>
				<div className={classes.metaItem}>
					<dt>
						<RefreshCw
							size={ICON_SIZE.sm}
							strokeWidth={ICON_STROKE}
							aria-hidden="true"
						/>
						更新
					</dt>
					<dd>{formatAbsolute(issue.updatedAt)}</dd>
				</div>
				<div className={classes.metaItem}>
					<dt>
						<Hash
							size={ICON_SIZE.sm}
							strokeWidth={ICON_STROKE}
							aria-hidden="true"
						/>
						識別子
					</dt>
					<dd className={classes.identifier}>{issue.id}</dd>
				</div>
			</dl>
		</div>
	);
}
