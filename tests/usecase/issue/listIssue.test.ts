import { describe, expect, test } from "vitest";
import type { Issue } from "../../../src/domain/issue/entity.js";
import { ListIssueUsecase } from "../../../src/usecase/issue/listIssue.js";
import { FakeIssueRepository } from "../../fakes/fakeIssueRepository.js";

describe("listIssuesUsecase", () => {
	// 正常系
	test("正常系: 複数Issue登録 → 全件取得", async () => {
		const repo = new FakeIssueRepository();
		const usecase = new ListIssueUsecase(repo);
		const issues: Issue[] = [
			{
				id: "test-id1",
				title: "test title1",
				description: "test description1",
				status: "open",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: "test-id2",
				title: "test title2",
				description: "test description2",
				status: "open",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		for (const issue of issues) {
			await repo.save(issue);
		}

		const result = await usecase.execute({});
		expect(result).toHaveLength(2);
	});

	test("フィルタ: status指定で絞り込み", async () => {
		const repo = new FakeIssueRepository();
		const usecase = new ListIssueUsecase(repo);
		const issues: Issue[] = [
			{
				id: "test-id1",
				title: "test title1",
				description: "test description1",
				status: "open",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: "test-id2",
				title: "test title2",
				description: "test description2",
				status: "closed",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		for (const issue of issues) {
			await repo.save(issue);
		}

		const result = await usecase.execute({ status: "open" });
		expect(result).toHaveLength(1);
		expect(result[0].status).toBe("open");
	});

	test("ページネーション: limit/offset の動作", async () => {
		const repo = new FakeIssueRepository();
		const usecase = new ListIssueUsecase(repo);
		// limit: 2, offset: 2
		const issues: Issue[] = [
			{
				id: "test-id1",
				title: "test title1",
				description: "test description1",
				status: "open",
				createdAt: new Date("2026-01-01"),
				updatedAt: new Date(),
			},
			{
				id: "test-id2",
				title: "test title2",
				description: "test description2",
				status: "closed",
				createdAt: new Date("2026-01-02"),
				updatedAt: new Date(),
			},
			{
				id: "test-id3",
				title: "test title3",
				description: "test description3",
				status: "open",
				createdAt: new Date("2026-01-03"),
				updatedAt: new Date(),
			},
			{
				id: "test-id4",
				title: "test title4",
				description: "test description4",
				status: "closed",
				createdAt: new Date("2026-01-04"),
				updatedAt: new Date(),
			},
		];

		for (const issue of issues) {
			await repo.save(issue);
		}

		const result = await usecase.execute({ limit: 2, offset: 2 });
		expect(result).toHaveLength(2);
		expect(result[0].id).toBe("test-id2");
		expect(result[1].id).toBe("test-id1");
	});
});
