import { randomUUID } from "node:crypto";
import type { Issue } from "../../domain/issue/entity.js";
import type { IssueRepository } from "../../domain/issue/repository.js";
import { parseIssueTitle } from "../../domain/issue/title.js";

export class CreateIssueUsecase {
	constructor(private repository: IssueRepository) {}

	async execute(input: {
		title: string;
		description?: string;
	}): Promise<Issue> {
		const title = parseIssueTitle(input.title);

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
