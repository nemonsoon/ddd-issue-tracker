import { describe, expect, test } from "vitest";
import { CreateIssueUsecase } from "../../../src/usecase/issue/createIssue.js";
import { FakeIssueRepository } from "../../fakes/fakeIssueRepository.js";

describe("CreateIssueUsecase", () => {
	test("titleを渡してIssueが返ること、status が openであること", async () => {
		const repo = new FakeIssueRepository();
		const usecase = new CreateIssueUsecase(repo);
		const issue = {
			title: "test",
			description: "test",
		};
		const result = await usecase.execute(issue);
		expect(result.id).toBeDefined();
		expect(result.title).toBe("test");
		expect(result.description).toBe("test");
		expect(result.status).toBe("open");
	});

	test("title が空文字でエラーが throw されること", async () => {
		const repo = new FakeIssueRepository();
		const usecase = new CreateIssueUsecase(repo);
		const issue = {
			title: "",
		};
		await expect(usecase.execute(issue)).rejects.toThrow();
	});
});
