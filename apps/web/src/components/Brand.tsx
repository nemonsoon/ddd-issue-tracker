import { SquareKanban } from "lucide-react";
import { ICON_SIZE, ICON_STROKE } from "../constants";
import classes from "../styles/Brand.module.css";

export function Brand() {
	return (
		<span className={classes.brand}>
			<SquareKanban
				className={classes.mark}
				size={ICON_SIZE.md}
				strokeWidth={ICON_STROKE}
				aria-hidden="true"
			/>
			Issue <span className={classes.accent}>Tracker</span>
		</span>
	);
}
