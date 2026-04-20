---
name: commit
description: 変更を論理的な単位でConventional Commits形式でコミットする
argument-hint: [メッセージ]
disable-model-invocation: true
allowed-tools: Bash(git *)
---

# コミット

変更を意味のある単位でコミットする。

## 手順

1. `git status` と `git diff` で変更内容を確認する
2. 論理的に関連する変更をまとめてステージングする（無関係な変更は分割）
3. Conventional Commits形式でメッセージを作成:

```
<type>: <日本語の説明>
```

4. ユーザーにメッセージを提案し、同意を得てからコミットする

## Type一覧

- `feat` — 新機能
- `fix` — バグ修正
- `chore` — 設定・雑務
- `docs` — ドキュメント
- `test` — テスト
- `refactor` — リファクタリング

## ルール

- 1コミット = 1つの論理的変更
- 関連しない変更を混ぜない
- 巨大な変更は分割提案する
- 引数がある場合はそれをメッセージとして使用する
