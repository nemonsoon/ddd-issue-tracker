# 04: ドメイン層 — Issue Entity型 + ドメインエラー

対応Issue: #4

## 手順

### 1. ディレクトリ作成

```bash
mkdir -p src/domain/issue
```

### 2. Entity型定義

`src/domain/issue/entity.ts`:
- `Issue` 型（type or interface）を定義
- フィールド: id, title, description, status, createdAt, updatedAt
- `status` は `"open" | "closed"` のunion typeにする（DBはstringだがドメインでは制約する）
- Prismaの型は一切importしない

### 3. ドメインエラー定義

`src/domain/issue/errors.ts`:
- `IssueNotFoundError` — 指定IDのIssueが見つからない
- Error クラスを継承したカスタムエラー
- `name` プロパティでエラー種別を識別可能にする

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
├── entity.ts     # Issue型
└── errors.ts     # IssueNotFoundError
```
