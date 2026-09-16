import type { IssueRepository } from "../../domain/issue/repository.js";
import { IssueNotFoundError } from "./errors.js";

export class DeleteIssueUseCase {
	constructor(private repository: IssueRepository) {}

	async execute(input: { id: string }): Promise<void> {
		const existing = await this.repository.findById(input.id);
		if (!existing) throw new IssueNotFoundError(input.id);
		return this.repository.delete(input.id);
	}
}
