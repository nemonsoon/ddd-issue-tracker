import { describe, expect, test } from "vitest";
import { InvalidIssueTitleError } from "../../../src/domain/issue/errors.js";
import { parseIssueTitle } from "../../../src/domain/issue/title.js";

describe("parseIssueTitle", () => {
	test("前後の空白を落とした題名を返す", () => {
		expect(parseIssueTitle("  test title  ")).toBe("test title");
	});

	test("空文字は題名として認めない", () => {
		expect(() => parseIssueTitle("")).toThrow(InvalidIssueTitleError);
	});

	test("空白だけの文字列は題名として認めない", () => {
		expect(() => parseIssueTitle("   ")).toThrow(InvalidIssueTitleError);
	});
});
