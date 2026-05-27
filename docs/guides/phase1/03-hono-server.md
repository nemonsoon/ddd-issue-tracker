# 03: Hono サーバー起動 + ヘルスチェック

対応Issue: #3

## 手順

### 1. Hono 導入

```bash
pnpm add hono @hono/node-server
```

### 2. エントリーポイント作成

`src/main.ts`:

- [x] Hono アプリケーション生成
- [x] `GET /health` → `{ status: "ok" }` を返すルート
- [x] `@hono/node-server` の `serve` で起動（port 3000）
- [x] 起動ログ出力

### 3. 動作確認

```bash
pnpm dev
# 別ターミナルで:
curl http://localhost:3000/health
# → {"status":"ok"}
```

### 4. tsc 確認

```bash
pnpm tsc --noEmit
```

## 補足

- Hono は `new Hono()` でアプリを作り、`app.get(path, handler)` でルート定義
- handler は `(c) => c.json({ ... })` の形式
- `@hono/node-server` は `serve({ fetch: app.fetch, port: 3000 })` で起動

## 完了状態

```
src/
└── main.ts       # Honoアプリ + ヘルスチェック + サーバー起動
```
