export class InvalidIssueTitleError extends Error {
	constructor() {
		super("titleは空にできません");
		this.name = "InvalidIssueTitleError";
	}
}
