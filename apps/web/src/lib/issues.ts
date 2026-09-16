export const ISSUE_STATUSES = ["open", "closed"] as const;

export type IssueStatus = (typeof ISSUE_STATUSES)[number];

// API は Date を ISO 8601 の文字列で返すため、画面側も文字列で受け取る。
export type Issue = {
	id: string;
	title: string;
	description: string;
	status: IssueStatus;
	createdAt: string;
	updatedAt: string;
};

export class ApiError extends Error {
	readonly status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

export function isIssueStatus(value: unknown): value is IssueStatus {
	return ISSUE_STATUSES.some((status) => status === value);
}

export async function fetchIssues(status?: IssueStatus): Promise<Issue[]> {
	const query = status === undefined ? "" : `?status=${status}`;
	const response = await fetch(`/api/issues${query}`);

	if (!response.ok) {
		throw new ApiError(await readErrorMessage(response), response.status);
	}

	const body: unknown = await response.json();
	if (!isIssueArray(body)) {
		throw new ApiError("課題一覧の形式が想定と違います", response.status);
	}
	return body;
}

export async function createIssue(input: {
	title: string;
	description: string;
}): Promise<Issue> {
	const response = await fetch("/api/issues", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(input),
	});

	if (!response.ok) {
		throw new ApiError(await readErrorMessage(response), response.status);
	}

	const body: unknown = await response.json();
	if (!isIssue(body)) {
		throw new ApiError("作成結果の形式が想定と違います", response.status);
	}
	return body;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isIssue(value: unknown): value is Issue {
	return (
		isRecord(value) &&
		typeof value.id === "string" &&
		typeof value.title === "string" &&
		typeof value.description === "string" &&
		isIssueStatus(value.status) &&
		typeof value.createdAt === "string" &&
		typeof value.updatedAt === "string"
	);
}

function isIssueArray(value: unknown): value is Issue[] {
	return Array.isArray(value) && value.every(isIssue);
}

async function readErrorMessage(response: Response): Promise<string> {
	try {
		const body: unknown = await response.json();
		if (isRecord(body) && typeof body.error === "string") {
			return body.error;
		}
	} catch {
		// 本文が読めないときは、状態コードだけで伝える。
	}
	return `サーバーが ${response.status} を返しました`;
}
