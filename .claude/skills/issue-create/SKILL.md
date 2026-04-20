---
name: issue-create
description: GitHub Issueを作成する。ラベル付きでタスクチケットとして起票
argument-hint: [タイトル]
disable-model-invocation: true
allowed-tools: Bash(gh *)
---

# Issue 作成

## 手順

1. ユーザーからタイトルと概要を確認する
2. 適切なラベルを選択する（複数可）:
   - `setup` — 環境構築・設定
   - `domain` — ドメイン層
   - `usecase` — ユースケース層
   - `infra` — インフラ層（DB実装）
   - `presentation` — HTTP/API層
   - `test` — テスト
   - `docs` — ドキュメント
3. Issue本文を作成（以下の構成）:
   - `## 概要` — 何をするか
   - `## 完了条件` — チェックリスト形式
   - 必要に応じて `## 補足`
4. ユーザーに内容を提示し、同意を得てから作成:

```bash
gh issue create --title "<タイトル>" --label "<ラベル>" --body "<本文>"
```
