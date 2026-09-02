import type { Issue } from "../../domain/issue/entity.js";
import { InvalidIssueTitleError } from "../../domain/issue/errors.js";
import type { IssueRepository } from "../../domain/issue/repository.js";
import { IssueNotFoundError } from "./errors.js";

export class UpdateIssueUseCase {
	constructor(private repository: IssueRepository) {}

	async execute(input: {
		id: string;
		title?: string;
		description?: string;
		status?: "open" | "closed";
	}): Promise<Issue> {
		const existing = await this.repository.findById(input.id);
		if (!existing) throw new IssueNotFoundError(input.id);

		// 作成時と同じ不変条件を更新でも守る
		let title = existing.title;
		if (input.title !== undefined) {
			title = input.title.trim();
			if (!title) throw new InvalidIssueTitleError();
		}

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
