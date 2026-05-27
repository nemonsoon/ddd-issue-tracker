# 13: Integrationテスト — CRUD一連フロー

対応Issue: #13

## 手順

### 1. ディレクトリ作成

```bash
mkdir -p tests/integration
```

### 2. テスト用DB設定

選択肢:
- **A) テスト用DBを別に用意**（docker-compose に test サービス追加）
- **B) 同じDBでテスト前にクリーンアップ**

最小構成では B で十分。テスト前に `prisma.issue.deleteMany()` を実行。

### 3. Integration テスト作成

`tests/integration/issue.test.ts`:
- Hono アプリを直接テスト（`app.request()` メソッド使用、HTTPサーバー起動不要）
- テストフロー:
  1. `POST /issues` → 201、レスポンスに id あり
  2. `GET /issues/:id` → 200、title一致
  3. `PATCH /issues/:id` → 200、status変更確認
  4. `GET /issues?status=closed` → 200、フィルタ動作
  5. `DELETE /issues/:id` → 204
  6. `GET /issues/:id` → 404

### 4. Vitest設定

integration テスト用に:
- タイムアウトを長めに設定（DB接続あるため）
- `beforeAll` で DB接続、`afterAll` で切断
- `beforeEach` でテーブルクリーンアップ

### 5. 実行

```bash
docker compose up -d
pnpm vitest run tests/integration
```

## 設計ポイント

- Hono の `app.request()` を使えば HTTP サーバーを起動せずにテスト可能
- Integration テストは「全レイヤーが正しく結合されているか」を検証する
- UseCase 単体テスト（Fake）とは目的が異なる:
  - 単体テスト: ビジネスロジックの正しさ
  - 統合テスト: 配線・マッピング・DB操作の正しさ

## 完了状態

```
tests/integration/
└── issue.test.ts
```
