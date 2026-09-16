import { RingProgress, Text } from "@mantine/core";
import { DONUT } from "../constants";
import type { Issue } from "../lib/issues";
import classes from "../styles/ProgressSummary.module.css";

export function ProgressSummary({ issues }: { issues: Issue[] }) {
	const completed = issues.filter((issue) => issue.status === "closed").length;
	const percent =
		issues.length === 0 ? 0 : Math.round((completed / issues.length) * 100);

	return (
		<div className={classes.summary}>
			<RingProgress
				role="img"
				aria-label={`${issues.length} 件中 ${completed} 件が完了`}
				size={DONUT.size}
				thickness={DONUT.thickness}
				roundCaps
				rootColor="gray.2"
				sections={[{ value: percent, color: "blue" }]}
				label={
					<Text ta="center" fz="xs" fw={700}>
						{percent}%
					</Text>
				}
			/>
			<Text size="sm" c="dimmed" className={classes.caption}>
				{issues.length} 件中 {completed} 件が完了
			</Text>
		</div>
	);
}
