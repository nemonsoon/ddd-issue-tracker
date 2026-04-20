---
name: issue-close
description: GitHub Issueを完了にする。PRマージ後やタスク完了時に使用
argument-hint: <issue番号>
allowed-tools: Bash(gh *)
---

# Issue クローズ

## 手順

1. 引数がない場合、現在のブランチ名からIssue番号を推測する（例: `feat/4-domain-entity` → #4）
2. Issue の内容を確認して表示する:

```bash
gh issue view <番号>
```

3. ユーザーに確認を取ってからクローズする:

```bash
gh issue close <番号> --reason completed
```

4. 関連するPRがまだopenならその旨を伝える
