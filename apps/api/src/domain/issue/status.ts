export const ISSUE_STATUSES = ["open", "closed"] as const;

export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export function isIssueStatus(value: string): value is IssueStatus {
	return ISSUE_STATUSES.some((status) => status === value);
}
