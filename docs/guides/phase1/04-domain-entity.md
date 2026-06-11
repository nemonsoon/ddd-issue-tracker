# 04: ドメイン層 — Issue Entity型 + ドメインエラー

対応Issue: #4

## 手順

### 1. ディレクトリ作成

```bash
mkdir -p src/domain/issue
```

### 2. Entity型定義

`src/domain/issue/entity.ts`:
- [x] `Issue` 型（type or interface）を定義
- [x] フィールド: id, title, description, status, createdAt, updatedAt
- [x] `status` は `"open" | "closed"` のunion typeにする（DBはstringだがドメインでは制約する）
- [x] Prismaの型は一切importしない

### 3. エラーの置き場所

「指定IDのIssueが見つからない」= `IssueNotFoundError` は **ドメインエラーではなくアプリケーション（UseCase）エラー**として扱う。理由は依存方向にある（詳細は [design-decisions.md](../../design-decisions.md)「エラーの層配置と『見つからない』の扱い」）。

- `IssueNotFoundError` は `src/usecase/issue/errors.ts` に定義する（このガイドでは作らない。#8 で UseCase と一緒に作る）
- `src/domain/issue/errors.ts` は **ドメインルール違反**専用（例: phase2 で追加する `InvalidIssueTitleError`）。Phase 1a の時点では空のまま、または未作成でよい
- カスタムエラーは Error クラスを継承し、`name` プロパティで種別を識別可能にする

### 4. 確認

```bash
pnpm tsc --noEmit
```

## 設計ポイント

- Entity型は「このデータはどんな形をしているか」だけを表現する
- ドメインメソッド（バリデーション、状態遷移）は Phase 1a では持たせない
- Prisma が生成する型とは **別物** — infra層でマッピングする

## 完了状態

```
src/domain/issue/
└── entity.ts     # Issue型
# errors.ts はドメインルール違反用。Phase 1a 時点では作らない（phase2 で InvalidIssueTitleError を追加）
# IssueNotFoundError は UseCase 層（src/usecase/issue/errors.ts、#8）に置く
```
