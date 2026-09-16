import type { Context } from "hono";
import { Hono } from "hono";
import type { z } from "zod";
import { z as zod } from "zod";
import type { Container } from "../container.js";
import { InvalidIssueTitleError } from "../domain/issue/errors.js";
import { ISSUE_STATUSES } from "../domain/issue/status.js";
import { toIssueView } from "./issueView.js";

// ここで検査するのは入力の「形」だけにする。
// 「題名が空でない」という業務規則は Domain 層が持つため、二重に書かない。
const listQuerySchema = zod.object({
	status: zod.enum(ISSUE_STATUSES).optional(),
});

const createIssueBodySchema = zod.object({
	title: zod.string(),
	description: zod.string().optional(),
});

export function createIssueRoutes(container: Container): Hono {
	const routes = new Hono();

	routes.get("/", async (c) => {
		const query = listQuerySchema.safeParse(c.req.query());
		if (!query.success) {
			return c.json(toValidationErrorBody(query.error), 400);
		}

		const issues = await container.listIssue.execute({
			status: query.data.status,
		});
		return c.json(issues.map(toIssueView), 200);
	});

	routes.post("/", async (c) => {
		const body = await readJsonBody(c);
		if (!body.ok) {
			return c.json({ error: "リクエスト本文を JSON として読めません" }, 400);
		}

		const input = createIssueBodySchema.safeParse(body.value);
		if (!input.success) {
			return c.json(toValidationErrorBody(input.error), 400);
		}

		try {
			const issue = await container.createIssue.execute(input.data);
			return c.json(toIssueView(issue), 201);
		} catch (error) {
			if (error instanceof InvalidIssueTitleError) {
				return c.json({ error: error.message }, 400);
			}
			// 想定していないエラーは握り潰さず、アプリ全体のエラー処理へ渡す。
			throw error;
		}
	});

	return routes;
}

type JsonBody = { ok: true; value: unknown } | { ok: false };

async function readJsonBody(c: Context): Promise<JsonBody> {
	try {
		const value: unknown = await c.req.json();
		return { ok: true, value };
	} catch {
		return { ok: false };
	}
}

function toValidationErrorBody(error: z.ZodError) {
	return {
		error: "入力の形式が正しくありません",
		details: error.issues.map((issue) => ({
			path: issue.path.join("."),
			message: issue.message,
		})),
	};
}
