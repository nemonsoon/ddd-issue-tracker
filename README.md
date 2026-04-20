# 🎯 DDD Issue Tracker

ドメイン駆動設計（DDD）とオニオンアーキテクチャに基づいて設計された Issue Tracker アプリケーション。

## 🏗️ アーキテクチャ

オニオンアーキテクチャを採用。依存方向は常に **外 → 内**。

```mermaid
graph LR
    P[🌐 Presentation] -->|depends on| U[⚙️ UseCase]
    U -->|depends on| D[💎 Domain]
    I[🗄️ Infra] -.->|implements| D

    style D fill:#5319E7,color:#fff
    style U fill:#1D76DB,color:#fff
    style I fill:#D93F0B,color:#fff
    style P fill:#FBCA04,color:#000
```

| レイヤー           | 責務                                           | 主な技術        |
| ------------------ | ---------------------------------------------- | --------------- |
| **Domain**         | Entity型、Repository interface、ドメインエラー | 純粋 TypeScript |
| **UseCase**        | ビジネスフロー調整（1ファイル1ユースケース）   | —               |
| **Infrastructure** | Repository interface の実装、DB通信            | Prisma          |
| **Presentation**   | ルーティング、バリデーション、レスポンス整形   | Hono, Zod       |

> 📖 詳細: [docs/architecture.md](docs/architecture.md)

## 🛠️ 技術スタック

| カテゴリ             | 技術                   |
| -------------------- | ---------------------- |
| 言語                 | TypeScript             |
| ランタイム           | Node.js                |
| パッケージマネージャ | pnpm                   |
| Web フレームワーク   | Hono                   |
| ORM                  | Prisma                 |
| DB                   | PostgreSQL 17 (Docker) |
| バリデーション       | Zod                    |
| テスト               | Vitest                 |
| リンター             | Biome                  |

## 🚀 セットアップ

### 前提条件

- Node.js
- pnpm
- Docker

### 手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/nuko-chan/ddd-issue-tracker.git
cd ddd-issue-tracker

# 2. 依存インストール
pnpm install

# 3. 環境変数を設定
cp .env.example .env

# 4. PostgreSQL 起動
docker compose up -d

# 5. マイグレーション実行
pnpm prisma migrate dev

# 6. 開発サーバー起動
pnpm dev
```

## 📝 開発コマンド

```bash
pnpm dev                    # 開発サーバー起動
pnpm tsc --noEmit           # 型チェック
pnpm biome check .          # lint
pnpm biome check --write .  # lint + auto fix
pnpm vitest run             # 全テスト実行
pnpm vitest run <path>      # 単体テスト指定実行
pnpm prisma migrate dev     # マイグレーション実行
pnpm prisma studio          # DB GUI 起動
```

## 📂 ディレクトリ構成

```
src/
├── domain/          # 💎 Entity型、Repository interface、ドメインエラー
├── usecase/         # ⚙️ ビジネスロジック（1ファイル1ユースケース）
├── infra/           # 🗄️ Prisma による Repository 実装
├── presentation/    # 🌐 Hono コントローラ、Zod スキーマ
└── main.ts          # エントリポイント
prisma/
├── schema.prisma    # DB スキーマ定義
└── migrations/      # マイグレーション履歴
docs/
├── architecture.md  # アーキテクチャ詳細
├── design-decisions.md  # 設計判断とトレードオフ
└── guides/          # 実装ガイド（Issue 単位）
```

## 📚 設計ドキュメント

- [アーキテクチャ](docs/architecture.md) — オニオンアーキテクチャの詳細とリクエストフロー
- [設計判断](docs/design-decisions.md) — 各技術選定のトレードオフ
- [ブランチ命名規則](docs/branch-naming.md) — Git ブランチの命名ルール
- [実装ガイド](docs/guides/) — Issue 単位のステップバイステップガイド
