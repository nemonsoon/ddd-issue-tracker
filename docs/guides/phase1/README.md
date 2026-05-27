# Phase 1: クリーンアーキテクチャの基礎

Issue #1〜#14 に対応するガイド集。
オニオンアーキテクチャの層分離・依存性逆転・DIを体感することが目的。

## ガイド一覧

| # | ファイル | テーマ | 対応Issue |
|---|---------|--------|----------|
| 01 | [01-project-init.md](01-project-init.md) | TypeScript + pnpm + Biome + Vitest セットアップ | #1 |
| 02 | [02-docker-prisma.md](02-docker-prisma.md) | Docker + PostgreSQL + Prisma | #2 |
| 03 | [03-hono-server.md](03-hono-server.md) | Hono ヘルスチェックエンドポイント | #3 |
| 04 | [04-domain-entity.md](04-domain-entity.md) | Issue Entity 型 + ドメインエラー | #4 |
| 05 | [05-domain-repository.md](05-domain-repository.md) | IssueRepository インターフェース | #5 |
| 06 | [06-fake-repository.md](06-fake-repository.md) | Fake Repository（テスト用実装） | #6 |
| 07 | [07-usecase-create.md](07-usecase-create.md) | CreateIssue UseCase + 単体テスト | #7 |
| 08 | [08-usecase-read.md](08-usecase-read.md) | GetIssue + ListIssue UseCase | #8 |
| 09 | [09-usecase-update-delete.md](09-usecase-update-delete.md) | UpdateIssue + DeleteIssue UseCase | #9 |
| 10 | [10-infra-prisma-repository.md](10-infra-prisma-repository.md) | PrismaIssueRepository 実装 | #10 |
| 11 | [11-presentation-controller.md](11-presentation-controller.md) | Hono コントローラー + Zod バリデーション | #11 |
| 12 | [12-di-wiring.md](12-di-wiring.md) | container.ts + main.ts DI配線 | #12 |
| 13 | [13-integration-test.md](13-integration-test.md) | CRUD 統合テスト | #13 |
| 14 | [14-readme-finalize.md](14-readme-finalize.md) | README + 設計ドキュメント整備 | #14 |

## 完了条件

- Issue の CRUD が全層（Domain → UseCase → Infra → Presentation）を通して動く
- 単体テスト・統合テストが通る
- 依存方向が常に外→内になっている
