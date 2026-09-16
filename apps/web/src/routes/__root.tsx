import { createRootRoute, Outlet } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";
import { StateMessage } from "../components/StateMessage";
import classes from "../styles/NotFound.module.css";

export const Route = createRootRoute({
	component: () => <Outlet />,
	notFoundComponent: () => (
		<div className={classes.wrapper}>
			<StateMessage
				icon={FileQuestion}
				title="ページが見つかりません"
				description="指定された住所に対応する画面はありません。課題一覧へ戻ってください。"
			/>
		</div>
	),
});
