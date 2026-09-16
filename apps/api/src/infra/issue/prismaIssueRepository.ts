import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { IssueModel } from "../../../generated/prisma/models.js";
import type { Issue } from "../../domain/issue/entity.js";
import type {
	IssueFilter,
	IssueRepository,
} from "../../domain/issue/repository.js";
import { isIssueStatus } from "../../domain/issue/status.js";
import { UnknownIssueStatusError } from "./errors.js";

export class PrismaIssueRepository implements IssueRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async save(issue: Issue): Promise<Issue> {
		const saved = await this.prisma.issue.create({ data: toRecord(issue) });
		return toEntity(saved);
	}

	async findById(id: string): Promise<Issue | null> {
		const found = await this.prisma.issue.findUnique({ where: { id } });
		return found === null ? null : toEntity(found);
	}

	async findAll(filter?: IssueFilter): Promise<Issue[]> {
		const found = await this.prisma.issue.findMany({
			where: filter?.status === undefined ? {} : { status: filter.status },
			// 画面は「更新日」の桁で並びを説明するため、新しく動いた課題を先頭に置く。
			orderBy: { updatedAt: "desc" },
			skip: filter?.offset,
			take: filter?.limit,
		});
		return found.map(toEntity);
	}

	async update(issue: Issue): Promise<Issue> {
		const updated = await this.prisma.issue.update({
			where: { id: issue.id },
			data: toRecord(issue),
		});
		return toEntity(updated);
	}

	async delete(id: string): Promise<void> {
		await this.prisma.issue.delete({ where: { id } });
	}
}

function toRecord(issue: Issue) {
	return {
		id: issue.id,
		title: issue.title,
		description: issue.description,
		status: issue.status,
		createdAt: issue.createdAt,
		updatedAt: issue.updatedAt,
	};
}

// 保存形式とドメインの形の差をここで吸収する。
// description は列が NULL を許すため、ドメインの空文字へ寄せる。
// status は列が単なる文字列のため、ドメインの型に入る値かを確かめてから通す。
function toEntity(record: IssueModel): Issue {
	if (!isIssueStatus(record.status)) {
		throw new UnknownIssueStatusError(record.id, record.status);
	}

	return {
		id: record.id,
		title: record.title,
		description: record.description ?? "",
		status: record.status,
		createdAt: record.createdAt,
		updatedAt: record.updatedAt,
	};
}
