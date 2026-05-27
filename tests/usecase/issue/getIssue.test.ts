import { describe, expect, test } from "vitest";
import type { Issue } from "../../../src/domain/issue/entity.js";
import { GetIssueUsecase } from "../../../src/usecase/issue/getIssue.js";
import { FakeIssueRepository } from "../../fakes/fakeIssueRepository.js";

describe("getIssueUsecase", () => {
	// 正常系
	test("事前にsaveしたIssueをIDで取得できること", async () => {
		const repo = new FakeIssueRepository();
		const usecase = new GetIssueUsecase(repo);
		const issue: Issue = {
			id: "test-id",
			title: "test title",
			description: "test description",
			status: "open",
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		repo.save(issue);
		const result = await usecase.execute(issue);
		expect(result.id).toBe(issue.id);
		expect(result.title).toBe(issue.title);
	});

	// 異常系
	test("存在しないID → IssueNotFoundError", async () => {
		const repo = new FakeIssueRepository();
		const usecase = new GetIssueUsecase(repo);
		await expect(usecase.execute({ id: "存在しないID" })).rejects.toThrow();
	});
});
