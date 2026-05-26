import type { Issue } from "../../domain/issue/entity.js";

import type { IssueRepository } from "../../domain/issue/repository.js";
import { IssueNotFoundError } from "./errors.js";

export class GetIssueUsecase {
	constructor(private repository: IssueRepository) {}

	async execute(input: { id: string }): Promise<Issue> {
		const result = await this.repository.findById(input.id);
		if (!result) throw new IssueNotFoundError(input.id);
		return result;
	}
}
