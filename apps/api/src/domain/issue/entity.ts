import type { IssueStatus } from "./status.js";

export type Issue = {
	id: string;
	title: string;
	description: string;
	status: IssueStatus;
	createdAt: Date;
	updatedAt: Date;
};
