---
name: project-navigator
description: |
  プロジェクトの現在地を把握し、次に取り組むべきIssueとその具体的な作業内容を提示するスキル。
  以下の場面で発火する:
  - セッション開始時にユーザーが最初の発言をしたとき（状況を把握してから応答するため）
  - ユーザーが「今どこ？」「状況確認して」「どこまでやったっけ」と聞いたとき
  - ユーザーが「次何やる？」「次のステップは？」「何が残ってる？」と言ったとき
  - 一つのIssueが完了した直後に次の作業を聞かれたとき
  - ユーザーの発言の文脈を理解するために、現在のブランチやIssueの状態を知る必要があるとき
  発火しない場面: 既に状況を把握した直後、特定のIssueの中身について議論しているとき
user-invocable: false
allowed-tools: Bash(git *) Bash(gh *) Read Glob
---

# プロジェクトナビゲーター

現在の作業状態を把握し、次のアクションを具体的に提示する。

## フェーズ1: 現在地の把握

### 1-1. Git状態の確認

```bash
git branch --show-current
git status --short
git log origin/main..HEAD --oneline 2>/dev/null
```

- mainにいる → 作業開始前 or 作業間のインターバル
- feature/bugfix等のブランチにいる → ブランチ名からIssue番号を読み取る

### 1-2. Issue進捗の確認

```bash
gh issue list --state open --json number,title,labels --limit 20
gh issue list --state closed --json number,title --limit 20
```

### 1-3. PRの状態

```bash
gh pr list --state open --json number,title,headRefName --limit 5
```

## フェーズ2: 状況判断

| 状態 | 意味 | 次のアクション |
|------|------|---------------|
| mainブランチ + 変更なし | 次のIssueに着手可能 | → フェーズ3へ |
| featureブランチ + 変更あり | そのIssueの作業中 | → 作業継続を案内 |
| featureブランチ + 変更なし + PR無し | ブランチ切ったばかり | → ガイドを読んで作業内容を案内 |
| featureブランチ + PR open | レビュー待ち or 修正中 | → PR状態を案内 |
| ローカルコミットが先行 | push待ち | → pushを促す |

## フェーズ3: 次のIssueのガイド調査

最も番号の小さいopen Issueを「次のタスク」とする。

### 3-1. 対応ガイドを探す

```bash
# Globツールで docs/guides/ 配下を検索
# パターン: docs/guides/<番号>-*.md
```

Globツールで `docs/guides/{番号:2桁ゼロ埋め}-*.md` を検索する。

### 3-2. ガイドを読む

見つかったガイドファイルをReadツールで読み、以下を抽出する:

- **ゴール**: このIssueで何を達成するか
- **作成するファイル**: どのパスにどんなファイルを作るか
- **テスト方針**: どんなテストを書くか
- **注意点**: アーキテクチャ上の制約や設計判断

## フェーズ4: 出力

```
🔍 現在の状態:
  ブランチ: <現在のブランチ>
  未コミット変更: あり/なし
  未pushコミット: N件
  PR: #XX open / なし

📊 プロジェクト進捗:
  ✅ 完了: #1 ..., #2 ...
  📋 残り: #4, #5, #6 ...

🎯 次のタスク: #N <タイトル>

📖 ガイド要約:
  ゴール: <ガイドから抽出したゴール>
  作成ファイル:
    - src/domain/issue/entity.ts（Entity型定義）
    - src/domain/issue/errors.ts（ドメインエラー）
  テスト: <テスト方針>
  注意点: <アーキテクチャ制約>

🌿 ブランチ案: <type>/<issue番号>-<description>
```

## ルール

- ガイドが見つからない場合はIssueのタイトルとラベルから推測し、ガイドなしである旨を伝える
- メンタリングモードに従い、作業内容の提示後にユーザーの理解確認を挟む
- 1応答1ステップ: 状況提示のみ行い、実装は始めない
