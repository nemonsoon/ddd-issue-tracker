# 開発コマンド

[← README](../README.md)

日々の開発で叩くコマンドを引くときに読む。
初回のセットアップは [README のセットアップ](../README.md#セットアップ)にある。

## 一覧

ルートのコマンドはワークスペース全体に向く。

```bash
pnpm dev                  # バックエンドの開発サーバー（3000番）
pnpm dev:web              # 画面の開発サーバー（5173番、/api を3000番へ転送）
pnpm build                # バックエンドと画面の両方をビルド
pnpm build:api            # バックエンドだけビルド
pnpm build:web            # 画面だけビルド
pnpm start                # ビルド済みの起動（Hono が画面と API の両方を配る）
pnpm test                 # テスト実行（内部で vitest run）
pnpm tsc                  # バックエンドと画面の型検査（tsc --noEmit）
pnpm tsc:api              # バックエンドだけ型検査
pnpm tsc:web              # 画面だけ型検査
pnpm check                # 静的検査と自動修正（biome check --write）
pnpm prisma <サブコマンド>  # apps/api の Prisma を実行（例: pnpm prisma migrate dev）
```

## テストを絞って実行する

ファイルを指定するときは、`apps/api` を基準にパスを渡す。

```bash
pnpm --filter api test tests/usecase/issue/createIssue.test.ts
```

## コミット前後に自動で走るもの

lefthook が2か所で検査を挟む。

| 契機 | 実行される内容 |
| --- | --- |
| `pre-commit` | `pnpm check`（対象は `*.{js,ts,jsx,tsx,md}`） |
| `pre-push` | `pnpm tsc` と `pnpm test`（並列） |

手元で同じ検査を先に通しておくと、push で弾かれない。
