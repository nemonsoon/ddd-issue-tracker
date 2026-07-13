// FakeIssueRepositoryを実装

import type { Issue } from "../../src/domain/issue/entity.js";
import type {
	IssueFilter,
	IssueRepository,
} from "../../src/domain/issue/repository.js";

export class FakeIssueRepository implements IssueRepository {
	private issues: Map<string, Issue> = new Map<string, Issue>();

	async save(issue: Issue): Promise<Issue> {
		this.issues.set(issue.id, issue);
		return issue;
	}

	async findById(id: string): Promise<Issue | null> {
		const issue = this.issues.get(id);
		if (!issue) return null;
		return issue;
	}

	async findAll(filter?: IssueFilter): Promise<Issue[]> {
		let result = [...this.issues.values()];
		if (filter?.status) {
			result = result.filter((issue) => issue.status === filter.status);
		}
		result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
		if (filter?.offset) {
			result = result.slice(filter.offset);
		}
		if (filter?.limit) {
			result = result.slice(0, filter.limit);
		}
		return result;
	}

	async update(issue: Issue): Promise<Issue> {
		this.issues.set(issue.id, issue);
		return issue;
	}

	async delete(id: string): Promise<void> {
		this.issues.delete(id);
		return;
	}
}
