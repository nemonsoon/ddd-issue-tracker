---
name: project-next-step
description: |
  プロジェクトの進捗を確認し、次に取り組むべきIssueを提案するスキル。作業の段取りを整える。
  以下の場面で発火する:
  - ユーザーが「次何やる？」「次のステップは？」「何が残ってる？」と言ったとき
  - 一つのIssueが完了した直後に次の作業を聞かれたとき
  - 「進捗どう？」「今どこまで？」と現状確認を求められたとき
  - セッション開始時に「どこからだっけ？」と聞かれたとき
  発火しない場面: 特定のIssueの中身について議論しているとき
allowed-tools: Bash(gh *) Bash(git *)
---

# 次のステップ確認

## 手順

1. open状態のIssueを番号順に取得する:

```bash
gh issue list --state open --json number,title,labels --limit 20
```

2. closed状態のIssueも取得して進捗を把握:

```bash
gh issue list --state closed --json number,title --limit 20
```

3. 最も番号の小さいopen Issueを「次のタスク」として提示する
4. 対応するガイドがあれば参照先を案内する（`docs/guides/<番号>-*.md`）
5. ユーザーが着手を決めたらブランチ作成を提案する

## 表示フォーマット

```
📊 進捗状況:
  ✅ 完了: #1 プロジェクト初期化, #2 Docker+Prisma ...
  📋 残り: #4, #5, #6 ...

🎯 次のタスク:
  #4 ドメイン層: Issue Entity型 + ドメインエラー [domain]

📖 ガイド: docs/guides/04-domain-entity.md
🌿 ブランチ案: feat/4-domain-entity
```
