# Learning Roadmap

このリポジトリは「何を・どの順で学ぶか」を定める。
「なぜその進め方をするか（予測先行・2つの合格条件・学習ログ）」は
[learning-method.md](learning-method.md) を参照（学習方法の唯一の正典）。

順序の原則：下のフェーズは上を前提にする。飛ばさない。

```
phase1            phase2                         phase3
クリーンアーキ → DDD 戦術パターン            → CQRS / Event Sourcing
層分離・依存逆転   VO→リッチEntity→集約→        events→Outbox→Projector→
                  ドメインイベント            Read Model（yasuraku の形に寄せる）
```

---

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

## Phase 2: DDD 戦術パターン（Issue #23〜#27 ＋ ドメインイベント）

**目的:** Phase 1 のコードをリファクタリングし、DDD の戦術パターンを導入する

**前提:** Phase 1 の層分離・依存逆転は引き続き守る。その上に DDD の要素を付加する。

**学ぶこと（すべて必須）:**

| パターン | 一言で言うと | このリポジトリでは |
|---------|------------|------------------|
| Value Object | 値に意味とルールを持たせる | `IssueTitle`, `IssueId` を導入し、バリデーションをVOに閉じ込める |
| Rich Entity | 状態遷移のルールをオブジェクト自身が守る | `issue.close()`, `issue.reopen()` メソッドで遷移ルールを表現 |
| Aggregate | 整合性を保証する境界を引く | Issue を Aggregate Root にし、Comment を子エンティティとして管理 |
| **ドメインイベント** | 「何が起きたか」を事実として記録する | `IssueClosed` などを集約から発行する |

> **変更点:** ドメインイベントは旧ロードマップで「応用・余裕があれば」だったが、
> Phase 3（Event Sourcing）の前提なので **必須に昇格**した。
> 専用 Issue は Phase 3 着手前に新設する。

**学ぶこと（応用・余裕があれば）:**

| パターン | 一言で言うと |
|---------|------------|
| Domain Service | 単一Entityに属さないドメインロジックの置き場 |

**ゴール:** 各パターンを「なぜ必要か」含めて自分の言葉で説明でき、最小スライスを自分で実装できること
（[2つの合格条件](learning-method.md#2-合格条件2つ測れる形にする)）

**方法:** Phase 1 で作ったコードの「困りごと」を起点に、パターンで解決するリファクタリング

**ガイド:** [docs/guides/phase2/](guides/phase2/)

---

## Phase 3: CQRS / Event Sourcing（Issue 新設・設計時に切る）

**目的:** 「何が起きたか」の履歴から現在状態を組み立てる設計を、自分の手で一度実装する

**前提:** Phase 2 のドメインイベントが導入済みであること

**学ぶこと:**

| 部品 | 一言で言うと | このリポジトリでは |
|------|------------|------------------|
| Event Store | 起きた事実を起きた順に貯める | `events` テーブルに Issue のイベントを追記する |
| Outbox | あとで反映すべきイベントを一時的に置く箱 | 未処理イベントを置く |
| Projector | イベントを読んで画面用テーブルを更新する係 | events を読み Read Model を更新する |
| Read Model | 画面が読みやすいよう整えた現在状態 | `issueRead` などの一覧・詳細用テーブル |
| 手動トリガー | ローカルで反映を手で走らせる仕組み | `process-outbox` 相当のエンドポイント |

**忠実度の方針:** 本物 yasuraku の形に 1 対 1 で寄せる。
道場を本物の CQRS / ES の縮尺模型にすれば、後で本物を読むのが楽になるため。
yasuraku 固有の選択と一般的な定石は、ガイド内で区別して注記する。

**ゴール:** events → Outbox → Projector → Read Model の薄い1本を自分で実装し、
「上げたのに出ない＝Projector 未処理」のような現象を自分で再現・説明できること

**推奨の締め:** 実装後に本物 yasuraku の同部分を読み、
「自分の実装と本物の違い」を学習ログに3点書く（[answer-key 読み](learning-method.md#6-推奨phase3-のあとに答え合わせ読みをする)）

**ガイド:** 設計時に `docs/guides/phase3/` を新設する
