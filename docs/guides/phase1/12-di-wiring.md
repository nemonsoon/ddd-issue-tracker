# 12: DI配線 — container.ts + main.ts 結合

対応Issue: #12

## 手順

### 1. container.ts 作成

`src/container.ts`:
- 全依存関係を組み立てる単一ファイル
- 組み立て順序:
  1. PrismaClient 生成
  2. PrismaIssueRepository 生成（PrismaClient を注入）
  3. 各 UseCase 生成（Repository を注入）
  4. IssueController 生成（UseCases を注入）
  5. Controller を export

### 2. main.ts 更新

`src/main.ts`:
- container から controller を import
- `app.route("/", controller)` でマウント
- ヘルスチェックはそのまま残す

### 3. 動作確認

```bash
docker compose up -d
pnpm dev
```

全エンドポイントを curl で確認:

```bash
# Create
curl -X POST http://localhost:3000/issues \
  -H "Content-Type: application/json" \
  -d '{"title": "最初のIssue"}'

# List
curl http://localhost:3000/issues

# Get
curl http://localhost:3000/issues/<id>

# Update
curl -X PATCH http://localhost:3000/issues/<id> \
  -H "Content-Type: application/json" \
  -d '{"status": "closed"}'

# Delete
curl -X DELETE http://localhost:3000/issues/<id>
```

## 設計ポイント

- container.ts は **Composition Root** — 依存グラフの組み立てはここだけ
- アプリケーションコード内で `new XxxRepository()` を直接書かない
- テスト時は container を使わず、Fake を直接注入する
- DIコンテナ（Inversify等）を使わない理由: 依存が少なく、手動で十分追える規模

## 完了状態

```
src/
├── container.ts   # Composition Root
└── main.ts        # サーバー起動 + ルートマウント
```
