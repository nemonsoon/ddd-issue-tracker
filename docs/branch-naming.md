# ブランチ命名規則

## フォーマット

```
<type>/<issue番号>-<短い説明>
```

## Type 一覧

| Type | 用途 |
|------|------|
| `feat` | 新機能・新しい層の実装 |
| `fix` | バグ修正 |
| `chore` | 設定・環境構築・CI |
| `docs` | ドキュメント |
| `test` | テスト追加・修正 |
| `refactor` | リファクタリング |

## 例

```
chore/1-project-init
feat/4-domain-entity
feat/7-usecase-create
test/13-integration-test
docs/14-readme-finalize
```

## 補足

- 番号は GitHub Issue 番号と対応させる
- 説明部分はケバブケース（小文字 + ハイフン区切り）
- 短く保つ（全体で40文字以内目安）
