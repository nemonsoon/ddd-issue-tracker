import { randomUUID } from "node:crypto";
import type { Issue } from "../../domain/issue/entity.js";
import { InvalidIssueTitleError } from "../../domain/issue/errors.js";
import type { IssueRepository } from "../../domain/issue/repository.js";

export class CreateIssueUsecase {
	constructor(private repository: IssueRepository) {}

	async execute(input: {
		title: string;
		description?: string;
	}): Promise<Issue> {
		const title = input.title.trim();
		if (!title) throw new InvalidIssueTitleError();

		const newIssue: Issue = {
			id: randomUUID(),
			title: title,
			description: input.description ?? "",
			status: "open",
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		return this.repository.save(newIssue);
	}
}
