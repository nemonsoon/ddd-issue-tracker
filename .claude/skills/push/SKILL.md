---
name: push
description: 現在のブランチをリモートにpushする
allowed-tools: Bash(git *)
---

# Push

現在のブランチをリモートにpushする。

## 手順

1. `git status` で未コミットの変更がないか確認
2. 未コミットの変更があればコミットするか確認
3. 現在のブランチ名を確認
4. 初回pushの場合は `-u origin <branch>` を使用
5. push実行

## ガード

- mainブランチへの直接pushは確認を求める
- force pushは原則禁止（明示的に依頼された場合のみ）
