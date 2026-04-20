---
name: next
description: 次に取り組むIssueを確認し、作業準備を整える
allowed-tools: Bash(gh *) Bash(git *)
---

# 次のステップ確認

## 手順

1. open状態のIssueを番号順に取得する:

```bash
gh issue list --state open --json number,title,labels --limit 20
```

2. 最も番号の小さいopen Issueを「次のタスク」として提示する
3. 対応するガイドがあれば参照先を案内する（`docs/guides/<番号>-*.md`）
4. ユーザーが着手を決めたら `/branch` でブランチ作成を提案する

## 表示フォーマット

```
現在の状況:
  完了: #1, #2, #3
  次: #4 ドメイン層: Issue Entity型 + ドメインエラー [domain]

ガイド: docs/guides/04-domain-entity.md
ブランチ案: feat/4-domain-entity
```
