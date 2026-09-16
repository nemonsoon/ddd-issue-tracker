export class UnknownIssueStatusError extends Error {
	constructor(id: string, status: string) {
		super(`保存されている status が不正です: id=${id}, status=${status}`);
		this.name = "UnknownIssueStatusError";
	}
}
