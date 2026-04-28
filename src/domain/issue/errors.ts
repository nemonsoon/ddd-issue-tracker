export class IssueNotFoundError extends Error {
	constructor(id: string) {
		super(`Issue not found: ${id}`);
		this.name = "IssueNotFoundError";
	}
}
