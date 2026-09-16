import type { Issue } from "../../domain/issue/entity.js";
import type { IssueRepository } from "../../domain/issue/repository.js";
import type { IssueStatus } from "../../domain/issue/status.js";

export class ListIssueUsecase {
	constructor(private repository: IssueRepository) {}

	async execute(input: {
		status?: IssueStatus;
		limit?: number;
		offset?: number;
	}): Promise<Issue[]> {
		return await this.repository.findAll(input);
	}
}
