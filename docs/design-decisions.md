# 設計判断とトレードオフ

[← README](../README.md)

なぜこの技術・この構造を選んだのかを確認したいときに読む。採用しなかった候補とその理由も扱う。

## オニオンアーキテクチャ採用

レイヤードアーキテクチャではなくオニオンアーキテクチャを採用。  
レイヤードでは上位層が下位層に直接依存するため、データベースの変更がドメインに波及する。オニオンではDomain層が依存の中心となり、InfraがDomainのインターフェースを実装する（依存性逆転）。テスタビリティとドメインの独立性を確保。

## Anemic Domain Model

Entityにドメインメソッドを持たせず、型定義のみ。  
現在のCRUD中心の実装ではRich Domain Modelの恩恵が薄い。層分離の構造を確立した後、ドメインロジックが増えた段階でメソッドを追加する。

## 層の分離にどこまで投資するか

投資するのは依存の向きと整合性の境界に限る。
層の数、ディレクトリ構成、同心円の図の再現には投資しない。

原典である [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)（2012-08-13）が挙げているのは、フレームワーク非依存・テスト可能・画面非依存・データベース非依存・外部非依存の5点と、「依存の向きは内向きのみ」という1つの規則だけである。
円が4つ描かれているのは図解の都合だと著者自身が明記している。

この線引きは外部の実測データとも整合する。

- [DORA 2025年レポート](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report)（2025-09-23）は、結合の緩いアーキテクチャと速いフィードバックを持つチームは生成AIの導入で成果を得るが、結合の強いシステムと遅い工程のチームはほとんど得ないと報告している
- [Balancing AI tensions](https://dora.dev/insights/balancing-ai-tensions/)（2026-03-10）は、強いAPIと明確なワークフローと強いテストが無い組織では、生成AIが技術的負債を加速するとしている

つまり「生成AIが書くから設計の分離は不要になる」という筋は、現時点のデータからは支持されない。

上記の出典と数値は 2026-08-31 に本文を照合済み。

## 採用しなかったもの

立ち上げ時（2026-05）に候補へ挙げたが、意図的に外したもの。

| 候補 | 外した理由 |
| --- | --- |
| fp-ts | 関数型のイディオムを同時に導入すると、層分離に由来する複雑さと切り分けられなくなる |
| TypeORM | Prisma のほうが型安全とマイグレーションの扱いで優る |
| Inversify | 下記「DIコンテナ不使用」を参照 |
| CQRS / Event Sourcing | 提唱側の [Martin Fowler](https://martinfowler.com/bliki/CQRS.html)（2011-07-14）自身が「大半のケースはうまくいっていない」と記し、適用先を境界づけられたコンテキストなど一部に限るよう処方している。このリポジトリの規模では利点が立たない |

## DIコンテナ不使用

InversifyなどのDIコンテナを使わず、`src/main.ts`で手動配線する。  
依存グラフが小規模（Repository 1つ、UseCase 5つ）であり、コンテナのデコレータ・リフレクション等の暗黙的挙動が利点を上回る。規模拡大時に導入を検討。

## statusをString型で保持

データベースのスキーマ上はenum制約を設けず、アプリケーション層のunion type (`"open" | "closed"`) で型安全性を確保。  
PostgreSQL enumは`ALTER TYPE`によるマイグレーションが煩雑。アプリケーションコードで制御する方がスキーマ変更に柔軟。

## テスト戦略: Fake > Mock

モックライブラリを使わず、手書きのFake Repositoryでテスト。  
Fakeはインターフェースの完全な実装であり、テスト対象の振る舞いをより正確に検証できる。モックは実装詳細への結合が起きやすい。

## エラーの層配置と「見つからない」の扱い

エラーを2層に分けて配置する。

- **ドメインエラー**（`src/domain/issue/errors.ts`）: ドメインのルール違反。例: `InvalidIssueTitleError`（タイトルが空）。ドメイン自身の不変条件を破ったときに発生する。
- **アプリケーションエラー**（`src/usecase/issue/errors.ts`）: ユースケース実行上の失敗。例: `IssueNotFoundError`（指定IDのIssueが存在しない）。

`IssueNotFoundError` をドメインではなく **UseCase 側**に置く理由は依存方向にある。「見つからない」を UseCase の関心とすれば、Repository（内側）は UseCase（外側）のエラーを import せずに済み、オニオンの依存方向（外→内）が自然に保たれる。逆に Repository がこのエラーを throw する設計だと、内側が外側に依存することになり破綻する。

したがって **Repository は「見つからない」を throw しない**。`findById` は `Issue | null` を返し、UseCase が null を検知して `IssueNotFoundError` を throw する。`update` / `delete` も同様に、UseCase が先に `findById` で存在確認し、無ければ throw する（Repository は純粋な永続化に徹する）。

「結果0件」と「見つからない」は区別する。一覧取得（`findAll`）の0件は正常系（空配列）、ID指定の取得・更新・削除で対象が無いのはアプリケーションエラー。
