# 設計判断とトレードオフ

## オニオンアーキテクチャ採用

レイヤードアーキテクチャではなくオニオンアーキテクチャを採用。  
レイヤードでは上位層が下位層に直接依存するため、DB変更がドメインに波及する。オニオンではDomain層が依存の中心となり、InfraがDomainのインターフェースを実装する（依存性逆転）。テスタビリティとドメインの独立性を確保。

## Anemic Domain Model（Phase 1）

Entityにドメインメソッドを持たせず、型定義のみ。  
CRUD中心の本フェーズではRich Domain Modelの恩恵が薄い。層分離の構造を確立した後、ドメインロジックが増えた段階でメソッドを追加する方針。

## DIコンテナ不使用

InversifyなどのDIコンテナを使わず、`src/container.ts`で手動配線。  
依存グラフが小規模（Repository 1つ、UseCase 5つ）であり、コンテナのデコレータ・リフレクション等の暗黙的挙動が利点を上回る。規模拡大時に導入を検討。

## statusをString型で保持

DBスキーマ上はenum制約を設けず、アプリケーション層のunion type (`"open" | "closed"`) で型安全性を確保。  
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
