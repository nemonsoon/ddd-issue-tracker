export class IssueNotFoundError extends Error {
	constructor(id: string) {
		super(`Issue not found: ${id}`);
		this.name = "IssueNotFoundError";
	}
}

export class InvalidIssueTitleError extends Error {
	constructor() {
		super("titleは空にできません");
		this.name = "InvalidIssueTitleError";
	}
}
