import "dotenv/config";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { PrismaPg } from "@prisma/adapter-pg";
import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma/client.js";
import { buildContainer } from "./container.js";
import { PrismaIssueRepository } from "./infra/issue/prismaIssueRepository.js";
import { createIssueRoutes } from "./presentation/issueRoutes.js";

const PORT = 3000;

// 書き出した画面の置き場。起動位置（apps/api）からの相対で指定する。
const WEB_DIST = "../web/dist";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("DATABASE_URL が設定されていません");
}

const prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl) });
const container = buildContainer(new PrismaIssueRepository(prisma));

const app = new Hono();

app.get("/health", (c) => {
	return c.json({ status: "ok" }, 200);
});

app.route("/api/issues", createIssueRoutes(container));

// 画面は同じサーバーから配る。開発中は Vite の開発サーバーを使うため、ここは空振りしてよい。
app.use("/*", serveStatic({ root: WEB_DIST }));

// 経路の解決は画面側が行うため、ファイルが無い住所は入口の HTML へ返す。
app.get("/*", serveStatic({ path: `${WEB_DIST}/index.html` }));

// 各ルートで扱わなかったエラーは、詳細を外へ出さずに 500 として返す。
app.onError((error, c) => {
	console.error(error);
	return c.json({ error: "サーバー側で処理できませんでした" }, 500);
});

const server = serve(
	{
		fetch: app.fetch,
		port: PORT,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);

// 接続を持ったまま落とさないよう、終了信号で片付ける。
for (const signal of ["SIGINT", "SIGTERM"] as const) {
	process.on(signal, () => {
		server.close(() => {
			void prisma.$disconnect();
		});
	});
}
