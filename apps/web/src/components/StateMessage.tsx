import { Text } from "@mantine/core";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ICON_SIZE, ICON_STROKE } from "../constants";
import classes from "../styles/StateMessage.module.css";

type Props = {
	icon: LucideIcon;
	title: string;
	description: string;
	tone?: "neutral" | "alert";
	action?: ReactNode;
};

export function StateMessage({
	icon: Icon,
	title,
	description,
	tone = "neutral",
	action,
}: Props) {
	return (
		<div className={classes.panel} data-tone={tone}>
			<Icon
				className={classes.icon}
				size={ICON_SIZE.md}
				strokeWidth={ICON_STROKE}
				aria-hidden="true"
			/>
			<Text fw={600}>{title}</Text>
			<Text size="sm" c="dimmed" mt="xs" className={classes.description}>
				{description}
			</Text>
			{action !== undefined && <div className={classes.action}>{action}</div>}
		</div>
	);
}
