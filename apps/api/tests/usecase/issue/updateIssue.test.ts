import { describe, expect, test } from "vitest";
import type { Issue } from "../../../src/domain/issue/entity.js";
import { InvalidIssueTitleError } from "../../../src/domain/issue/errors.js";
import { IssueNotFoundError } from "../../../src/usecase/issue/errors.js";
import { UpdateIssueUseCase } from "../../../src/usecase/issue/updateIssue.js";
import { FakeIssueRepository } from "../../fakes/fakeIssueRepository.js";

describe("updateIssueUsecase", () => {
	// 正常系
	test("status を open → closed に更新できる", async () => {
		// ① 準備(Arrange): open の Issue を1件保存しておく
		const repo = new FakeIssueRepository();
		const usecase = new UpdateIssueUseCase(repo);
		const issue: Issue = {
			id: "test-id",
			title: "test title",
			description: "test description",
			status: "open",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		await repo.save(issue);

		// ② 実行(Act): 変えたい所だけ渡す（id と status だけ）
		const result = await usecase.execute({ id: "test-id", status: "closed" });

		// ③ 検証(Assert): 確かめたいのは「status が closed になったか」
		expect(result.status).toBe("closed");
	});
	test("title のみ部分更新（他フィールドは変わらない）", async () => {
		const repo = new FakeIssueRepository();
		const usecase = new UpdateIssueUseCase(repo);
		const issue: Issue = {
			id: "test-id",
			title: "test title",
			description: "test description",
			status: "open",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		await repo.save(issue);

		const result = await usecase.execute({
			id: "test-id",
			title: "test title2",
		});

		expect(result.title).toBe("test title2");
		expect(result.description).toBe("test description");
		expect(result.status).toBe("open");
		expect(result.createdAt).toEqual(issue.createdAt);
	});
	test("空白だけのタイトルへは更新できない", async () => {
		const repo = new FakeIssueRepository();
		const usecase = new UpdateIssueUseCase(repo);
		const issue: Issue = {
			id: "test-id",
			title: "test title",
			description: "test description",
			status: "open",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		await repo.save(issue);

		await expect(
			usecase.execute({ id: "test-id", title: "   " }),
		).rejects.toThrow(InvalidIssueTitleError);
	});
	test("タイトルの前後の空白は落として更新する", async () => {
		const repo = new FakeIssueRepository();
		const usecase = new UpdateIssueUseCase(repo);
		const issue: Issue = {
			id: "test-id",
			title: "test title",
			description: "test description",
			status: "open",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		await repo.save(issue);

		const result = await usecase.execute({
			id: "test-id",
			title: "  test title2  ",
		});

		expect(result.title).toBe("test title2");
	});
	test("存在しないID", async () => {
		const repo = new FakeIssueRepository();
		const usecase = new UpdateIssueUseCase(repo);
		const issue: Issue = {
			id: "test-id",
			title: "test title",
			description: "test description",
			status: "open",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		await repo.save(issue);

		await expect(
			usecase.execute({
				id: "存在しないID",
			}),
		).rejects.toThrow(IssueNotFoundError);
	});
});
