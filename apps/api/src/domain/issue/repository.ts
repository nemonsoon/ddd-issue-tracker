import type { Issue } from "./entity.js";
import type { IssueStatus } from "./status.js";

export type IssueFilter = {
	status?: IssueStatus;
	limit?: number;
	offset?: number;
};

export interface IssueRepository {
	save(issue: Issue): Promise<Issue>; // 新規保存
	findById(id: string): Promise<Issue | null>; // ID検索
	findAll(filter?: IssueFilter): Promise<Issue[]>; // 複数件検索
	update(issue: Issue): Promise<Issue>; // 更新
	delete(id: string): Promise<void>; // 削除
}
