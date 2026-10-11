import type { Issue } from "../../domain/issue/entity.js";
import type { IssueRepository } from "../../domain/issue/repository.js";
import type { IssueStatus } from "../../domain/issue/status.js";
import { parseIssueTitle } from "../../domain/issue/title.js";
import { IssueNotFoundError } from "./errors.js";

export class UpdateIssueUseCase {
	constructor(private repository: IssueRepository) {}

	async execute(input: {
		id: string;
		title?: string;
		description?: string;
		status?: IssueStatus;
	}): Promise<Issue> {
		const existing = await this.repository.findById(input.id);
		if (!existing) throw new IssueNotFoundError(input.id);

		const title =
			input.title === undefined ? existing.title : parseIssueTitle(input.title);

		const updated: Issue = {
			...existing,
			title,
			description: input.description ?? existing.description,
			status: input.status ?? existing.status,
			updatedAt: new Date(),
		};
		return this.repository.update(updated);
	}
}
