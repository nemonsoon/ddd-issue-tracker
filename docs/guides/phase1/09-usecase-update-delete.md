# 09: UseCase層 — UpdateIssue + DeleteIssue + 単体テスト

対応Issue: #9

## 手順

### 1. UpdateIssue UseCase

`src/usecase/issue/updateIssue.ts`:
- 入力: `{ id: string, title?: string, description?: string, status?: "open" | "closed" }`
- 処理:
  1. `repository.findById(id)` で既存Issue取得
  2. 見つからない → `IssueNotFoundError`
  3. 渡されたフィールドのみ上書き（部分更新）
  4. `repository.update(updatedIssue)` で保存
  5. 更新後の Issue を返す

### 2. DeleteIssue UseCase

`src/usecase/issue/deleteIssue.ts`:
- 入力: `{ id: string }`
- 処理:
  1. `repository.findById(id)` で存在確認
  2. 見つからない → `IssueNotFoundError`
  3. `repository.delete(id)` で削除
  4. void を返す

### 3. 単体テスト

`tests/usecase/issue/updateIssue.test.ts`:
- 正常系: status を "open" → "closed" に更新
- 正常系: title のみ部分更新（他フィールドは変わらない）
- 異常系: 存在しないID

`tests/usecase/issue/deleteIssue.test.ts`:
- 正常系: 削除後に findById → null
- 異常系: 存在しないID

```bash
pnpm test
```

## 設計ポイント

- 部分更新: undefined のフィールドは「更新しない」を意味する
- 存在確認を先にするのは「楽観的ロック」ではないが、明示的なエラーハンドリングのため
- delete の前に存在確認するかどうかは判断が分かれる（冪等性 vs 明示的エラー）

## 完了状態

```
src/usecase/issue/
├── createIssue.ts
├── getIssue.ts
├── listIssues.ts
├── updateIssue.ts
└── deleteIssue.ts
tests/usecase/issue/
├── createIssue.test.ts
├── getIssue.test.ts
├── listIssues.test.ts
├── updateIssue.test.ts
└── deleteIssue.test.ts
```
