# Phase 2: DDD 戦術パターン

Issue #15〜#19 に対応するガイド集。
Phase 1 で作ったコードをリファクタリングし、DDDの戦術パターンを導入することが目的。

## 前提

- Phase 1 の層分離・依存逆転は引き続き守る
- Phase 1 のコードにある「困りごと」を起点にパターンを導入する
- 各ガイドには原則の説明・図解・現実の例えを含む

## ガイド一覧

| # | ファイル | テーマ | 対応Issue |
|---|---------|--------|----------|
| 01 | [01-value-object-issue-title.md](01-value-object-issue-title.md) | Value Object: IssueTitle | #15 |
| 02 | [02-value-object-issue-id.md](02-value-object-issue-id.md) | Value Object: IssueId | #16 |
| 03 | [03-rich-entity-status.md](03-rich-entity-status.md) | Rich Entity: ステータス遷移 | #17 |
| 04 | [04-aggregate-issue-comment.md](04-aggregate-issue-comment.md) | Aggregate: Issue + Comment | #18 |
| 05 | [05-phase2-test-refactoring.md](05-phase2-test-refactoring.md) | テスト・リファクタリング整備 | #19 |

## 学習の進め方

1. ガイドの「原則」セクションを読み、概念を理解する
2. 「このリポジトリの問題」セクションで、Phase 1 コードの困りごとを確認する
3. 「実装ステップ」に沿ってリファクタリングを進める
4. テストで動作を確認する
5. 自分の言葉で「なぜこのパターンが必要か」を説明できるか振り返る

## 完了条件

- Value Object / Rich Entity / Aggregate を導入済み
- 各パターンを「なぜ必要か」含めて自分の言葉で説明できる
- 全テストが通る
- 依存方向が守られている
