---
name: project-status-check
description: |
  プロジェクトの現在地を把握するスキル。今どのIssueに取り組んでいるか、ブランチの状態、進捗を確認する。
  以下の場面で発火する:
  - セッション開始時にユーザーが最初の発言をしたとき（状況を把握してから応答するため）
  - ユーザーが「今どこ？」「状況確認して」「どこまでやったっけ」と聞いたとき
  - ユーザーの発言の文脈を理解するために、現在のブランチやIssueの状態を知る必要があるとき
  - 作業の途中で「これどのIssueの話？」と確認が必要なとき
  発火しない場面: 既に状況を把握した直後に再度確認する必要がないとき
user-invocable: false
allowed-tools: Bash(git *) Bash(gh *)
---

# プロジェクト状況把握

セッション開始時やコンテキストが不明なときに、現在の作業状態を把握する。

## 確認手順

### 1. 現在のブランチ確認

```bash
git branch --show-current
git status --short
```

- mainにいる → 作業開始前 or 作業間のインターバル
- feature/bugfix等のブランチにいる → 作業中。ブランチ名からIssue番号を読み取る

### 2. GitHub Issueの進捗確認

```bash
gh issue list --state open --json number,title,labels --limit 20
gh issue list --state closed --json number,title --limit 20
```

- closedのIssue = 完了済みフェーズ
- openの最小番号 = 現在 or 次のフェーズ

### 3. 未コミット/未push確認

```bash
git status --short
git log origin/main..HEAD --oneline 2>/dev/null
```

- 未コミットの変更がある → 作業途中
- ローカルコミットが先行 → push待ち

### 4. PRの状態

```bash
gh pr list --state open --json number,title,headRefName --limit 5
```

- openなPRがある → レビュー待ち or 作業中

## 判断ロジック

上記情報から以下を判断する:

| 状態 | 意味 |
|------|------|
| mainブランチ + 変更なし | 次のIssueに着手する準備ができている |
| featureブランチ + 変更あり | そのIssueの作業中 |
| featureブランチ + 変更なし + PR無し | コミット忘れ or ブランチ切ったばかり |
| featureブランチ + PR open | レビュー待ち or 修正中 |

## 出力フォーマット（内部判断用、ユーザーには要約して伝える）

```
🔍 現在の状態:
  ブランチ: feat/4-domain-entity (Issue #4 対応)
  未コミット変更: あり/なし
  未pushコミット: N件
  PR: #XX open / なし

📊 プロジェクト進捗:
  完了: #1, #2, #3
  作業中: #4
  残り: #5〜#14

📖 対応ガイド: docs/guides/04-domain-entity.md
```
