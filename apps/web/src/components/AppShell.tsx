import { Anchor } from "@mantine/core";
import { Code } from "lucide-react";
import type { ReactNode } from "react";
import { ICON_SIZE, ICON_STROKE, REPOSITORY } from "../constants";
import classes from "../styles/AppShell.module.css";
import { Brand } from "./Brand";

type Props = {
	aside: ReactNode;
	children: ReactNode;
};

export function AppShell({ aside, children }: Props) {
	return (
		<div className={classes.shell}>
			<header className={classes.topbar}>
				<Brand />

				{/* 見た人が出どころをたどれるようにする。作者もここで分かる */}
				<Anchor
					className={classes.source}
					href={REPOSITORY.url}
					target="_blank"
					rel="noreferrer"
					c="dimmed"
					underline="never"
				>
					<Code
						size={ICON_SIZE.sm}
						strokeWidth={ICON_STROKE}
						aria-hidden="true"
					/>
					<span className={classes.sourceName}>{REPOSITORY.name}</span>
				</Anchor>
			</header>

			<div className={classes.body}>
				<div className={classes.content}>
					<main>{children}</main>
					<aside aria-label="今週の注目事項と課題の詳細">{aside}</aside>
				</div>
			</div>
		</div>
	);
}
