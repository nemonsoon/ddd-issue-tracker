# 05: テスト・リファクタリング整備

対応Issue: #27

---

## 目的

Phase 2 で導入した Value Object / Rich Entity / Aggregate により、テストコードと既存の UseCase・Infra に修正が必要です。このガイドでは、全体の整合性を確認し、リファクタリングを仕上げます。

---

## Phase 2 で変わったこと — 振り返り

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  Before (Phase 1)                After (Phase 2)          │
│                                                           │
│  Issue = type（データ入れ物）     Issue = class（振る舞い付き）│
│  id: string                     id: IssueId               │
│  title: string                  title: IssueTitle          │
│  status を直接変更               close() / reopen()        │
│  Comment なし                   Comment = 子エンティティ    │
│  バリデーションは UseCase        バリデーションは VO         │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## チェックリスト

### 1. ドメイン層のテスト確認

以下のテストがすべて書かれていて、通ることを確認する:

- [ ] `issueTitle.test.ts` — 生成・バリデーション・等価性
- [ ] `issueId.test.ts` — 生成・generate・等価性
- [ ] `entity.test.ts` — create / reconstruct / close / reopen / addComment

### 2. UseCase のリファクタリング

各 UseCase が以下に従っているか確認する:

```
┌──────────────────────────────────────────────────────┐
│  UseCase の責務（Phase 2 版）                          │
│                                                       │
│  ✅ やるべきこと:                                      │
│    - 入力を受け取り、VO / Entity のメソッドを呼ぶ       │
│    - Repository を使って永続化する                      │
│    - エラーを適切に伝播する                             │
│                                                       │
│  ❌ やってはいけないこと:                               │
│    - バリデーション（→ VO の責務）                      │
│    - ステータス遷移の判断（→ Entity の責務）             │
│    - 整合性の管理（→ Aggregate Root の責務）            │
│                                                       │
└──────────────────────────────────────────────────────┘
```

確認すべき UseCase:
- [ ] `CreateIssueUsecase` — `Issue.create()` + `IssueTitle` を使っているか
- [ ] `GetIssueUsecase` — `IssueId` を受け取っているか
- [ ] `ListIssueUsecase` — 変更の必要があるか確認
- [ ] `UpdateIssueUsecase` — `issue.close()` / `issue.reopen()` を使っているか
- [ ] `DeleteIssueUsecase` — `IssueId` を受け取っているか

### 3. UseCase のテスト修正

- [ ] `createIssue.test.ts` — IssueTitle / IssueId を使うように修正
- [ ] `getIssue.test.ts` — IssueId を使うように修正
- [ ] `listIssue.test.ts` — 必要に応じて修正
- [ ] `updateIssue.test.ts` — close / reopen のテスト追加
- [ ] `deleteIssue.test.ts` — IssueId を使うように修正

### 4. Fake Repository の修正確認

- [ ] `FakeIssueRepository` が新しい Entity（class）を正しく保存・復元できる
- [ ] Comment も含めて保存・取得できる
- [ ] `fakeIssueRepository.test.ts` が通る

### 5. Infra 層の修正（PrismaIssueRepository）

Phase 1 で Infra 層を実装済みの場合:

- [ ] `PrismaIssueRepository` が VO ↔ DB 変換を行っているか
  - DB保存時: `issue.title.value` で string を取り出す
  - DB取得時: `Issue.reconstruct()` で Entity を復元する
- [ ] Comment テーブルの Prisma スキーマが追加されているか
- [ ] Issue 取得時に Comment も一緒に取得する（`include: { comments: true }`）

### 6. 全テスト実行

```bash
pnpm vitest run
pnpm tsc --noEmit
pnpm check
```

すべて通ることを確認する。

---

## よくある修正パターン

### パターン1: string → VO への変換

```
Before:
  const issue = { id: "abc", title: "Bug fix", ... }

After:
  const issue = Issue.create(
    new IssueTitle("Bug fix"),
    "description"
  )
```

### パターン2: 直接変更 → メソッド呼び出し

```
Before:
  const updated = { ...issue, status: "closed" }

After:
  issue.close()
```

### パターン3: Repository の型変更

```
Before:
  findById(id: string): Promise<Issue | null>

After:
  findById(id: IssueId): Promise<Issue | null>
```

---

## 設計の振り返り — Phase 2 で何を学んだか

Phase 2 の最後に、以下の問いに自分の言葉で答えてみてください:

1. **Value Object**: 「IssueTitle はなぜ string ではなくクラスにしたのか？」
2. **Rich Entity**: 「issue.status = "closed" ではなく issue.close() にしたのはなぜか？」
3. **Aggregate**: 「CommentRepository を作らなかったのはなぜか？」

これらに答えられれば、DDD の戦術パターンの基礎が身についています。

## 完了状態

```
src/domain/issue/
├── comment.ts       # 子エンティティ
├── entity.ts        # Rich Entity（class）
├── errors.ts        # 全ドメインエラー
├── issueId.ts       # Value Object
├── issueTitle.ts    # Value Object
└── repository.ts    # Aggregate 対応
tests/
├── domain/issue/
│   ├── entity.test.ts      # Entity のテスト
│   ├── issueId.test.ts     # VO のテスト
│   └── issueTitle.test.ts  # VO のテスト
├── fakes/
│   ├── fakeIssueRepository.ts      # Aggregate 対応
│   └── fakeIssueRepository.test.ts
└── usecase/issue/
    ├── createIssue.test.ts   # VO 対応に修正
    ├── getIssue.test.ts
    ├── listIssue.test.ts
    ├── updateIssue.test.ts   # close/reopen テスト
    └── deleteIssue.test.ts
```
