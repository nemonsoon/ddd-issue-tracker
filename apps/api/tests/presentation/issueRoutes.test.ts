import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import { buildContainer } from "../../src/container.js";
import type { Issue } from "../../src/domain/issue/entity.js";
import { createIssueRoutes } from "../../src/presentation/issueRoutes.js";
import type { IssueView } from "../../src/presentation/issueView.js";
import { FakeIssueRepository } from "../fakes/fakeIssueRepository.js";

type ErrorBody = {
	error: string;
	details?: { path: string; message: string }[];
};

function buildApp() {
	const repository = new FakeIssueRepository();
	const app = new Hono();
	app.route("/api/issues", createIssueRoutes(buildContainer(repository)));
	return { app, repository };
}

function buildIssue(override: Partial<Issue>): Issue {
	return {
		id: "00000000-0000-4000-8000-000000000000",
		title: "既定の題名",
		description: "",
		status: "open",
		createdAt: new Date("2026-01-01T00:00:00.000Z"),
		updatedAt: new Date("2026-01-01T00:00:00.000Z"),
		...override,
	};
}

function postIssue(app: Hono, body: unknown) {
	return app.request("/api/issues", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(body),
	});
}

describe("POST /api/issues", () => {
	it("題名と説明を受け取って課題を作成する", async () => {
		const { app } = buildApp();

		const res = await postIssue(app, {
			title: "課題を作る",
			description: "説明文",
		});
		const body: IssueView = await res.json();

		expect(res.status).toBe(201);
		expect(body.title).toBe("課題を作る");
		expect(body.description).toBe("説明文");
		expect(body.status).toBe("open");
		expect(body.id).not.toBe("");
		expect(body.createdAt).toBe(new Date(body.createdAt).toISOString());
		expect(body.updatedAt).toBe(new Date(body.updatedAt).toISOString());
	});

	it("説明を省くと空文字で作成する", async () => {
		const { app } = buildApp();

		const res = await postIssue(app, { title: "説明なし" });
		const body: IssueView = await res.json();

		expect(res.status).toBe(201);
		expect(body.description).toBe("");
	});

	it("題名が空白だけなら 400 を返す", async () => {
		const { app } = buildApp();

		const res = await postIssue(app, { title: "   " });
		const body: ErrorBody = await res.json();

		expect(res.status).toBe(400);
		expect(body.error).toBe("titleは空にできません");
	});

	it("題名が文字列でなければ 400 を返す", async () => {
		const { app } = buildApp();

		const res = await postIssue(app, { title: 1 });
		const body: ErrorBody = await res.json();

		expect(res.status).toBe(400);
		expect(body.details?.map((detail) => detail.path)).toContain("title");
	});

	it("本文が JSON として読めなければ 400 を返す", async () => {
		const { app } = buildApp();

		const res = await app.request("/api/issues", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: "{",
		});

		expect(res.status).toBe(400);
	});

	it("作成した課題は一覧から読める", async () => {
		const { app } = buildApp();

		await postIssue(app, { title: "一覧に出る課題" });
		const res = await app.request("/api/issues");
		const body: IssueView[] = await res.json();

		expect(res.status).toBe(200);
		expect(body.map((issue) => issue.title)).toEqual(["一覧に出る課題"]);
	});
});

describe("GET /api/issues", () => {
	it("課題が無ければ空の配列を返す", async () => {
		const { app } = buildApp();

		const res = await app.request("/api/issues");
		const body: IssueView[] = await res.json();

		expect(res.status).toBe(200);
		expect(body).toEqual([]);
	});

	it("status を指定するとその状態だけ返す", async () => {
		const { app, repository } = buildApp();
		await repository.save(buildIssue({ id: "open-1", title: "未完了の課題" }));
		await repository.save(
			buildIssue({ id: "closed-1", title: "完了した課題", status: "closed" }),
		);

		const res = await app.request("/api/issues?status=closed");
		const body: IssueView[] = await res.json();

		expect(res.status).toBe(200);
		expect(body.map((issue) => issue.title)).toEqual(["完了した課題"]);
	});

	it("status を指定しなければ全件返す", async () => {
		const { app, repository } = buildApp();
		await repository.save(buildIssue({ id: "open-1" }));
		await repository.save(buildIssue({ id: "closed-1", status: "closed" }));

		const res = await app.request("/api/issues");
		const body: IssueView[] = await res.json();

		expect(res.status).toBe(200);
		expect(body).toHaveLength(2);
	});

	it("扱えない status を指定すると 400 を返す", async () => {
		const { app } = buildApp();

		const res = await app.request("/api/issues?status=unknown");
		const body: ErrorBody = await res.json();

		expect(res.status).toBe(400);
		expect(body.details?.map((detail) => detail.path)).toContain("status");
	});

	it("Date は ISO 8601 の文字列として返す", async () => {
		const { app, repository } = buildApp();
		await repository.save(
			buildIssue({
				createdAt: new Date("2026-02-03T04:05:06.007Z"),
				updatedAt: new Date("2026-02-03T04:05:06.008Z"),
			}),
		);

		const res = await app.request("/api/issues");
		const body: IssueView[] = await res.json();

		expect(body[0]?.createdAt).toBe("2026-02-03T04:05:06.007Z");
		expect(body[0]?.updatedAt).toBe("2026-02-03T04:05:06.008Z");
	});
});
