import { describe, expect, test } from "vitest";
import type { Issue } from "../../../src/domain/issue/entity.js";
import { DeleteIssueUseCase } from "../../../src/usecase/issue/deleteIssue.js";
import { IssueNotFoundError } from "../../../src/usecase/issue/errors.js";
import { FakeIssueRepository } from "../../fakes/fakeIssueRepository.js";

describe("deleteIssueUsecase", () => {
	// 正常系
	test("削除後はfindByIdでnullになる", async () => {
		const repo = new FakeIssueRepository();
		const usecase = new DeleteIssueUseCase(repo);
		const issue: Issue = {
			id: "test-id",
			title: "test title",
			description: "test description",
			status: "open",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		await repo.save(issue);

		await usecase.execute({ id: "test-id" });

		expect(await repo.findById(issue.id)).toBeNull();
	});

	// 異常系
	test("存在しないID → IssueNotFoundError", async () => {
		const repo = new FakeIssueRepository();
		const usecase = new DeleteIssueUseCase(repo);

		await expect(usecase.execute({ id: "存在しないID" })).rejects.toThrow(
			IssueNotFoundError,
		);
	});
});
