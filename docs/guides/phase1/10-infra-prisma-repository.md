# 10: Infra層 — PrismaIssueRepository 実装

対応Issue: #10

## 手順

### 1. ディレクトリ作成

```bash
mkdir -p src/infra/prisma
```

### 2. PrismaClient 初期化

`src/infra/prisma/client.ts`:
- PrismaClient のシングルトンインスタンスを export
- 開発時のホットリロードで複数インスタンスが生まれないよう考慮

### 3. PrismaIssueRepository 実装

`src/infra/prisma/issueRepository.ts`:
- `IssueRepository` interface を import して implements
- コンストラクタで `PrismaClient` を受け取る
- 各メソッド実装:
  - `save`: `prisma.issue.create()`
  - `findById`: `prisma.issue.findUnique()`
  - `findAll`: `prisma.issue.findMany()` + where/take/skip
  - `update`: `prisma.issue.update()`
  - `delete`: `prisma.issue.delete()`

### 4. 型マッピング

Prisma が返す型 → ドメイン Issue 型への変換関数を用意:

```typescript
function toDomain(prismaIssue: PrismaIssue): Issue {
  return {
    id: prismaIssue.id,
    title: prismaIssue.title,
    description: prismaIssue.description,
    status: prismaIssue.status as "open" | "closed",
    createdAt: prismaIssue.createdAt,
    updatedAt: prismaIssue.updatedAt,
  }
}
```

### 5. 確認

```bash
pnpm tsc --noEmit
```

## 設計ポイント

- infra 層は domain 層の **インターフェースを実装する側**（依存性逆転）
- Prisma の型がドメインに漏れないよう、必ずマッピングを挟む
- `status` の `as "open" | "closed"` キャストは、DB に不正値が入るリスクを受容している（Phase 1b で enum 化時に解消）

## 完了状態

```
src/infra/prisma/
├── client.ts            # PrismaClient シングルトン
└── issueRepository.ts   # PrismaIssueRepository
```
