# Learning Roadmap

このプロジェクトは2つのフェーズに分かれています。

## Phase 1: クリーンアーキテクチャの基礎（Issue #1〜#14）

**目的:** 層分離・依存性逆転・DIを体感する

**学ぶこと:**
- オニオンアーキテクチャの各層（Domain / UseCase / Infra / Presentation）
- 依存方向の制御（外→内。Domain は何にも依存しない）
- Repository インターフェースによる依存性逆転
- Fake Repository による単体テスト
- 手動DIによる配線

**ゴール:** Issue の CRUD が Domain → UseCase → Infra → Presentation の全層を通して動くこと

**ガイド:** [docs/guides/phase1/](guides/phase1/)

---

## Phase 2: DDD 戦術パターン（Issue #23〜#27）

**目的:** Phase 1 のコードをリファクタリングし、DDD の戦術パターンを導入する

**前提:** Phase 1 の層分離・依存逆転は引き続き守る。その上に DDD の要素を付加する。

**学ぶこと（必須）:**

| パターン | 一言で言うと | このリポジトリでは |
|---------|------------|------------------|
| Value Object | 値に意味とルールを持たせる | `IssueTitle`, `IssueId` を導入し、バリデーションをVOに閉じ込める |
| Rich Entity | 状態遷移のルールをオブジェクト自身が守る | `issue.close()`, `issue.reopen()` メソッドで遷移ルールを表現 |
| Aggregate | 整合性を保証する境界を引く | Issue を Aggregate Root にし、Comment を子エンティティとして管理 |

**学ぶこと（応用・余裕があれば）:**

| パターン | 一言で言うと |
|---------|------------|
| ドメインイベント | 何が起きたかを記録し、副作用を分離する |
| Domain Service | 単一Entityに属さないドメインロジックの置き場 |

**ゴール:** 各パターンを「なぜ必要か」含めて自分の言葉で説明できること

**方法:** Phase 1 で作ったコードの「困りごと」を起点に、パターンで解決するリファクタリング

**ガイド:** [docs/guides/phase2/](guides/phase2/)
