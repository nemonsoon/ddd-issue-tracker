import { Badge } from "@mantine/core";
import type { LucideIcon } from "lucide-react";
import { CircleCheck, CircleDot } from "lucide-react";
import { ICON_SIZE, ICON_STROKE } from "../constants";
import type { IssueStatus } from "../lib/issues";

const STATUS: Record<
	IssueStatus,
	{ label: string; color: string; icon: LucideIcon }
> = {
	open: { label: "Open", color: "blue", icon: CircleDot },
	closed: { label: "Closed", color: "teal", icon: CircleCheck },
};

export function StatusPill({ status }: { status: IssueStatus }) {
	const { label, color, icon: Icon } = STATUS[status];

	return (
		<Badge
			variant="light"
			color={color}
			size="lg"
			leftSection={
				<Icon
					size={ICON_SIZE.sm}
					strokeWidth={ICON_STROKE}
					aria-hidden="true"
				/>
			}
		>
			{label}
		</Badge>
	);
}
