import type { Issue } from "../domain/issue/entity.js";
import type { IssueStatus } from "../domain/issue/status.js";

export type IssueView = {
	id: string;
	title: string;
	description: string;
	status: IssueStatus;
	createdAt: string;
	updatedAt: string;
};

// Date は JSON に載らないため、ISO 8601 の文字列へ変換して返す。
export function toIssueView(issue: Issue): IssueView {
	return {
		id: issue.id,
		title: issue.title,
		description: issue.description,
		status: issue.status,
		createdAt: issue.createdAt.toISOString(),
		updatedAt: issue.updatedAt.toISOString(),
	};
}
