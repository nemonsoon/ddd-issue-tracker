import { Skeleton } from "@mantine/core";
import { SKELETON_BAR_HEIGHT, SKELETON_ROW_WIDTHS } from "../constants";
import classes from "../styles/IssueListSkeleton.module.css";

export function IssueListSkeleton() {
	return (
		<div aria-hidden="true">
			{SKELETON_ROW_WIDTHS.map((width) => (
				<div key={width} className={classes.row}>
					<Skeleton height={SKELETON_BAR_HEIGHT} />
					<Skeleton height={SKELETON_BAR_HEIGHT} width={width} />
					<Skeleton height={SKELETON_BAR_HEIGHT} />
					<Skeleton height={SKELETON_BAR_HEIGHT} />
				</div>
			))}
		</div>
	);
}
