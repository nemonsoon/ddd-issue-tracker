import type { Issue } from "../../domain/issue/entity.js";
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
		const updated: Issue = {
			...existing,
			title: input.title ?? existing.title,
			description: input.description ?? existing.description,
			status: input.status ?? existing.status,
			updatedAt: new Date(),
		};
		return this.repository.update(updated);
	}
}
