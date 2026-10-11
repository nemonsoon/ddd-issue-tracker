import { InvalidIssueTitleError } from "./errors.js";

// 題名の規則はここにだけ書く。
// 題名を受け取る UseCase は必ずこの関数を通す。
export function parseIssueTitle(raw: string): string {
	const title = raw.trim();
	if (!title) throw new InvalidIssueTitleError();
	return title;
}
