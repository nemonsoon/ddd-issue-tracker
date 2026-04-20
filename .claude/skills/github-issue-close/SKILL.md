---
name: github-issue-close
description: |
  GitHub Issueを完了状態にクローズするスキル。タスクの完了を記録する。
  以下の場面で発火する:
  - ユーザーが「Issue完了」「#4終わった」「クローズして」と言ったとき
  - PRがマージされた後に対応するIssueを閉じる必要があるとき
  - 「このタスク終わり」「done」など完了を示す発言があったとき
  - /next スキルの前に現在のIssueを閉じる必要があるとき
  発火しない場面: まだ作業中のとき、PRがマージされていないとき
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
