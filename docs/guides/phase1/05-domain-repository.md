# 05: ドメイン層 — IssueRepository インターフェース

対応Issue: #5

## 手順

### 1. Repository interface 作成

`src/domain/issue/repository.ts`:
- `IssueRepository` interface を定義
- メソッド:
  - `save(issue): Promise<Issue>` — 新規保存
  - `findById(id): Promise<Issue | null>` — ID検索
  - `findAll(filter?): Promise<Issue[]>` — 一覧取得（フィルタ対応）
  - `update(issue): Promise<Issue>` — 更新
  - `delete(id): Promise<void>` — 削除

### 2. フィルタ型の定義

findAll のフィルタ引数の型を定義:

```typescript
type IssueFilter = {
  status?: "open" | "closed"
  limit?: number
  offset?: number
}
```

entity.ts に同居させるか、repository.ts に置くか判断する。

### 3. 確認

```bash
pnpm tsc --noEmit
```

## 設計ポイント

- このインターフェースは **契約** — 「データアクセスに何ができるか」を定義する
- 実装は知らない（Prismaかもしれないし、インメモリかもしれない）
- 戻り値は必ずドメインの `Issue` 型（Prisma型を漏らさない）
- `save` と `update` を分けるか `save` に統合するか（upsert）は設計判断

## 完了状態

```
src/domain/issue/
├── entity.ts
├── repository.ts  # IssueRepository interface
└── errors.ts
```
