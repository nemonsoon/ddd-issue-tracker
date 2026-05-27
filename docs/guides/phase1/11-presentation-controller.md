# 11: Presentation層 — Zodスキーマ + Honoコントローラ

対応Issue: #11

## 手順

### 1. ディレクトリ作成

```bash
mkdir -p src/presentation/http
```

### 2. Zod 導入 + スキーマ定義

```bash
pnpm add zod
```

`src/presentation/http/schemas.ts`:

```typescript
// POST /issues
createIssueSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
})

// PATCH /issues/:id
updateIssueSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["open", "closed"]).optional(),
})

// GET /issues クエリ
listIssuesQuerySchema = z.object({
  status: z.enum(["open", "closed"]).optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
})
```

### 3. Honoコントローラ

`src/presentation/http/issueController.ts`:
- Hono の Router（`new Hono()`）を作成
- 各エンドポイント:
  - `POST /issues` → Zod でバリデーション → CreateIssue UseCase → 201
  - `GET /issues` → クエリパース → ListIssues UseCase → 200
  - `GET /issues/:id` → GetIssue UseCase → 200 / 404
  - `PATCH /issues/:id` → Zod でバリデーション → UpdateIssue UseCase → 200 / 404
  - `DELETE /issues/:id` → DeleteIssue UseCase → 204 / 404

### 4. エラーハンドリング

- Zod バリデーション失敗 → 400 + エラー詳細
- `IssueNotFoundError` → 404 + メッセージ
- 予期しないエラー → 500

### 5. 確認

```bash
pnpm tsc --noEmit
```

## 設計ポイント

- コントローラはUseCaseを呼ぶだけ。ビジネスロジックを書かない
- Zodスキーマ = presentation層のバリデーション（ドメインバリデーションとは別）
- HTTPレスポンスコードの決定はpresentation層の責務
- UseCaseをコンストラクタ or ファクトリで受け取る（テスト可能にするため）

## 完了状態

```
src/presentation/http/
├── schemas.ts           # Zodバリデーションスキーマ
└── issueController.ts   # Honoルーター
```
