import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// テストファイルの探索先（デフォルトは **/*.test.ts）
		include: ["tests/**/*.test.ts"],
		// テスト用の環境変数や設定を分離したい場合
		// setupFiles: ["tests/setup.ts"],
	},
});
