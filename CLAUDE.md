# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install              # 依存インストール
docker compose up -d      # PostgreSQL起動
pnpm prisma migrate dev   # マイグレーション実行
pnpm dev                  # 開発サーバー起動
pnpm tsc --noEmit         # 型チェック
pnpm check                # lint + auto fix (biome check --write)
pnpm vitest run           # 全テスト
pnpm vitest run <path>    # 単体テスト指定実行
pnpm build                # TypeScriptビルド
pnpm start                # ビルド後の本番サーバー起動
```

## Architecture

オニオンアーキテクチャ。依存方向は常に外→内。

`presentation → usecase → domain ← infra`

```
src/
  domain/         # Entity型, Repository interface, Domain Error
  usecase/        # 1ファイル1ユースケース
  infra/          # Prisma Repository実装（未作成）
  presentation/   # Hono ルーティング + Zod バリデーション（未作成）
  container.ts    # 手動DI配線（未作成）
  main.ts         # エントリーポイント
tests/
  fakes/          # Fake Repository実装
  usecase/        # ユースケーステスト
```

詳細: [docs/architecture.md](docs/architecture.md)

## Design Decisions

詳細: [docs/design-decisions.md](docs/design-decisions.md)

## Git Hooks (lefthook)

- **pre-commit**: `pnpm check`（対象: `*.{js,ts,jsx,tsx,md}`、内部で `@biomejs/biome check --write` を実行）
- **pre-push**: `pnpm run tsc` + `pnpm test`（並列実行）

## Environment

`.env` に以下を設定（`.env`はgitignore済み）:

```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

## Testing

Fake Repository（インターフェースの完全実装）を使う。モックライブラリは不使用。

## Mentoring Mode

このプロジェクトではClaudeはメンター役。コード生成前に設計意図を説明し同意を得る。1応答1ステップ。理解確認を挟んでから次へ進む。

## Review Workflow

ユーザーはIssue単位でブランチを切って実装し、PRを出す。レビュー依頼されたら以下の観点で評価する:

1. **層分離** — 依存方向が正しいか。domainに外部依存(Prisma等)が漏れていないか
2. **型安全性** — any回避、適切なunion type、null handling
3. **テスト** — 正常系+異常系が網羅されているか、Fakeの使い方が正しいか
4. **命名・構造** — 意図が伝わるか、ファイル配置がアーキテクチャと整合するか
5. **理解度確認** — 実装意図を質問し、説明を求める（答えを先に出さない）

レビュー後、問題なければapproveし、修正点があれば具体的に指摘する。
