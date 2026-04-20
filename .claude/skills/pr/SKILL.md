---
name: pr
description: GitHub Pull Requestを作成する。ブランチ名からIssue番号を推測しテンプレートに沿って作成
argument-hint: [issue番号]
allowed-tools: Bash(git *) Bash(gh *)
---

# Pull Request 作成

## 手順

1. 現在のブランチとmainの差分を確認:

```bash
git log main..HEAD --oneline
git diff main --stat
```

2. ブランチ名からIssue番号を推測する（例: `feat/4-domain-entity` → #4）
3. PRテンプレート（.github/pull_request_template.md）に沿って内容を作成:
   - タイトル: `<type>: <説明>`（日本語、70文字以内）
   - 本文:
     - 概要（1-3行）
     - `Closes #<番号>`
     - 変更内容（箇条書き）
     - 確認方法（コマンド例）
     - チェックリスト
4. ユーザーに内容を提示し、同意を得てから `gh pr create` を実行

## 引数

- 引数でIssue番号が渡された場合はそれを使用
- 引数がない場合はブランチ名から推測
