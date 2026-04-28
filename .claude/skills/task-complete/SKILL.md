---
name: task-complete
description: |
  タスク完了ワークフロー。レビュー→commit→push→PR作成→次タスク提示を一気通貫で行う。
  以下の場面で発火する:
  - ユーザーが「できた」「完了」「終わった」「done」「レビューして」と言ったとき
  - 実装が一段落し「まとめて出したい」「PRまで一気にやって」と言ったとき
  - ユーザーが「確認して、問題なければPRまでお願い」と言ったとき
  発火しない場面: まだ作業途中のとき、mainブランチで変更がないとき、個別操作（commitだけ、pushだけ）を明示されたとき
user-invocable: true
argument-hint: [完了メッセージ]
allowed-tools: Bash(git *) Bash(gh *) Bash(pnpm *) Read Glob Agent
---

# タスク完了ワークフロー

## 前提チェック

- featureブランチにいること（mainなら中止）
- 変更またはコミットが存在すること（なければ中止）

## フェーズ1: 並列調査（Agentツールで2つ同時起動）

### Agent A: 現状把握

以下を調査して返す:

```
- git branch --show-current
- git status --short
- git log origin/main..HEAD --oneline
- gh issue list --state open --json number,title,labels --limit 20
- ブランチ名からIssue番号を抽出（例: feat/4-domain-entity → #4）
- 該当Issueのガイド docs/guides/{番号:2桁ゼロ埋め}-*.md を読む
```

返却フォーマット:
```
ブランチ: feat/4-domain-entity
Issue: #4 ドメイン層: Issue Entity型 + ドメインエラー定義
未コミット変更: あり/なし
未pushコミット: N件
ガイドのゴール: <ガイドから抽出>
ガイドの完了状態: <期待されるファイル構成>
```

### Agent B: コードレビュー

以下を実行して品質を検証:

```bash
git diff main --stat
git diff main              # 差分の内容を確認
pnpm tsc --noEmit          # 型チェック
pnpm vitest run            # テスト実行
```

レビュー観点（CLAUDE.mdのReview Workflowに準拠）:
1. 層分離 — 依存方向が正しいか、domainに外部依存が漏れていないか
2. 型安全性 — any回避、適切なunion type、null handling
3. テスト — 正常系+異常系の網羅、Fakeの使い方
4. 命名・構造 — 意図が伝わるか、ファイル配置がアーキテクチャと整合するか

返却フォーマット:
```
tsc: ✅ / ❌ (エラー内容)
test: ✅ / ❌ (失敗内容)
レビュー結果: OK / 問題あり
問題点: (あれば箇条書き)
```

## フェーズ2: 結果統合と判断

Agent A, Bの結果を統合して提示する。

### 問題ありの場合 → 停止

```
⚠️ レビュー結果: 問題あり

[問題点の解説]
- 具体的に何が問題か
- どう修正すべきか
- アーキテクチャ上の根拠

修正後にもう一度 /task-complete を実行してください。
```

**ここでスキル終了。shipに進まない。**

### 問題なしの場合 → ユーザーに確認

```
✅ レビュー結果: OK

[Agent Aの現状サマリ]
[Agent Bのレビューサマリ]

commit → push → PR作成 に進みます。よいですか？
```

## フェーズ3: Ship（ユーザー同意後）

### 3-1. Commit

- `git status` と `git diff` で変更を確認
- 論理的に関連する変更をまとめてステージング
- Conventional Commits形式:
  ```
  <type>: <日本語の説明> (#<Issue番号>)

  Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
  ```
- コミットメッセージをユーザーに提案し同意を得る

### 3-2. Push

```bash
git push -u origin <ブランチ名>
```

- mainへの直接pushは禁止
- force push禁止

### 3-3. PR作成

- PRテンプレート（.github/pull_request_template.md）に沿って作成
- 本文に `Closes #<Issue番号>` を含める（merge時にIssue自動close）
- `gh pr create` で起票

### 3-4. 次タスク提示

- 次に番号の小さいopen Issueを特定
- ガイド docs/guides/{番号:2桁ゼロ埋め}-*.md を確認
- 次のタスクのゴールとブランチ案を提示

```
📋 次のタスク: #N <タイトル>
🌿 ブランチ案: <type>/<issue番号>-<description>
```

## ルール

- フェーズ2で問題がある場合は必ず停止する。自動修正して進めない
- 各段階でユーザーの同意を得てから次に進む（メンタリングモード）
- 既にコミット済み・push済みの場合はそのステップをスキップする
