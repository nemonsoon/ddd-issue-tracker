# 08: UseCase層 — GetIssue + ListIssues + 単体テスト

対応Issue: #8

## 手順

### 1. GetIssue UseCase

`src/usecase/issue/getIssue.ts`:

- 入力: `{ id: string }`
- 処理: `repository.findById(id)`
- 見つからない場合: `IssueNotFoundError` を throw
- 見つかった場合: Issue を返す

### 2. ListIssues UseCase

`src/usecase/issue/listIssues.ts`:

- 入力: `{ status?: "open" | "closed", limit?: number, offset?: number }`
- 処理: `repository.findAll(filter)` をそのまま呼ぶ
- デフォルト値（limit: 20, offset: 0）を UseCase 側で設定するか、Repository に任せるか判断

### 3. 単体テスト

`tests/usecase/issue/getIssue.test.ts`:

- 正常系: 事前にsaveしたIssueをIDで取得
- 異常系: 存在しないID → IssueNotFoundError

`tests/usecase/issue/listIssues.test.ts`:

- 正常系: 複数Issue登録 → 全件取得
- フィルタ: status指定で絞り込み
- ページネーション: limit/offset の動作

```bash
pnpm test
```

## 設計ポイント

- GetIssue で「見つからない」は **ドメインエラー**（IssueNotFoundError）
- ListIssues で結果0件は **正常系**（空配列を返す）
- この違いを意識する: 「存在しないこと」がエラーかどうかは文脈による

## 完了状態

```
src/usecase/issue/
├── createIssue.ts
├── getIssue.ts
└── listIssues.ts
tests/usecase/issue/
├── createIssue.test.ts
├── getIssue.test.ts
└── listIssues.test.ts
```
