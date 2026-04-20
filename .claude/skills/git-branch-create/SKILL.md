---
name: git-branch-create
description: |
  Gitブランチを命名規則に従って作成するスキル。
  以下の場面で発火する:
  - ユーザーが「ブランチ作って」「ブランチ切って」と言ったとき
  - 新しいIssueに着手する宣言があったとき（「Issue #4やる」「次のやつ始める」）
  - /next スキルの結果としてブランチ作成が必要になったとき
  - 「作業開始」「着手する」など新しい作業の開始を示す発言があったとき
  発火しない場面: すでにfeatureブランチにいるとき、ブランチの話題ではないとき
argument-hint: [type/番号-説明]
allowed-tools: Bash(git *)
---

# ブランチ作成

命名規則（docs/branch-naming.md 参照）に従ってブランチを作成する。

## フォーマット

```
<type>/<issue番号>-<短い説明>
```

## Type一覧

- `feat` — 新機能・新しい層の実装
- `fix` — バグ修正
- `chore` — 設定・環境構築・CI
- `docs` — ドキュメント
- `test` — テスト追加・修正
- `refactor` — リファクタリング

## 手順

1. 引数がある場合はそのまま使用する
2. 引数がない場合はユーザーにIssue番号と内容を確認する
3. mainブランチから最新を取得してからブランチを作成する:

```bash
git checkout main
git pull origin main
git checkout -b <ブランチ名>
```

## 例

```
feat/4-domain-entity
chore/1-project-init
test/13-integration-test
```
