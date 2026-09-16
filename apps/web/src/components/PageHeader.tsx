import { Button, Text, Title } from "@mantine/core";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { ICON_SIZE, ICON_STROKE } from "../constants";
import classes from "../styles/PageHeader.module.css";

type Props = {
	title: string;
	lead: string;
	onCreate: (() => void) | undefined;
	filter: ReactNode;
	progress: ReactNode;
};

export function PageHeader({ title, lead, onCreate, filter, progress }: Props) {
	return (
		<header className={classes.header}>
			<div className={classes.top}>
				<div className={classes.text}>
					<Title order={1}>{title}</Title>
					<Text c="dimmed" mt="xs">
						{lead}
					</Text>
				</div>
				{onCreate !== undefined && (
					<Button
						size="md"
						onClick={onCreate}
						leftSection={<Plus size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} />}
					>
						New issue
					</Button>
				)}
			</div>

			{/* 絞り込みと進捗は、どちらも全体についての情報なので同じ行に置く */}
			<div className={classes.stats}>
				<div>{filter}</div>
				<div>{progress}</div>
			</div>
		</header>
	);
}
