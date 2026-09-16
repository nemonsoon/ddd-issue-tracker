import { describe, expect, test } from "vitest";
import type { Issue } from "../../src/domain/issue/entity.js";
import { FakeIssueRepository } from "./fakeIssueRepository.js";

describe("FakeIssueRepository", () => {
	test("saveしたIssueをfindByIdで取得できる", async () => {
		const repo = new FakeIssueRepository();
		const issue: Issue = {
			id: "1",
			title: "test",
			description: "test",
			status: "open",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		await repo.save(issue);
		const foundIssue = await repo.findById("1");
		expect(foundIssue).toEqual(issue);
	});

	test("存在しないIDでfindByIdするとnullを返す", async () => {
		const repo = new FakeIssueRepository();
		const foundIssue = await repo.findById("1");
		expect(foundIssue).toBeNull();
	});

	test("deleteしたIssueはfindByIdでnullになる", async () => {
		const repo = new FakeIssueRepository();
		const issue: Issue = {
			id: "1",
			title: "test",
			description: "test",
			status: "open",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		await repo.save(issue);
		await repo.delete("1");
		const foundIssue = await repo.findById("1");
		expect(foundIssue).toBeNull();
	});
});
