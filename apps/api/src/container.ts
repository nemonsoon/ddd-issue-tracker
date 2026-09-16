import type { IssueRepository } from "./domain/issue/repository.js";
import { CreateIssueUsecase } from "./usecase/issue/createIssue.js";
import { ListIssueUsecase } from "./usecase/issue/listIssue.js";

// HTTP から到達できるユースケースだけを並べる。
// 取得・更新・削除は、対応するエンドポイントを足すときに加える。
export type Container = {
	createIssue: CreateIssueUsecase;
	listIssue: ListIssueUsecase;
};

// Repository を引数で受け取るのは、本番では Prisma、テストでは Fake を渡すため。
// ここが Prisma を知らないので、テストは生成物を読み込まずに済む。
export function buildContainer(repository: IssueRepository): Container {
	return {
		createIssue: new CreateIssueUsecase(repository),
		listIssue: new ListIssueUsecase(repository),
	};
}
