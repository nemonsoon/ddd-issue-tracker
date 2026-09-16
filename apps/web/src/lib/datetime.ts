import { RELATIVE_TIME_LIMIT_DAYS } from "../constants";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const absoluteFormatter = new Intl.DateTimeFormat("ja-JP", {
	year: "numeric",
	month: "long",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
});

export function formatRelative(
	isoDate: string,
	now: Date = new Date(),
): string {
	const elapsed = now.getTime() - new Date(isoDate).getTime();

	if (elapsed < MINUTE) return "たった今";
	if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)} 分前`;
	if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)} 時間前`;
	if (elapsed < RELATIVE_TIME_LIMIT_DAYS * DAY) {
		return `${Math.floor(elapsed / DAY)} 日前`;
	}
	return formatAbsolute(isoDate);
}

export function formatAbsolute(isoDate: string): string {
	return absoluteFormatter.format(new Date(isoDate));
}
