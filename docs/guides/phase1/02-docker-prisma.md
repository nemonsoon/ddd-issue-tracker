# 02: Docker Compose + PostgreSQL + Prisma

対応Issue: #2

## 手順

### 1. Docker Compose 作成

`docker-compose.yml`:
- PostgreSQL 16 イメージ
- ポート: `5432:5432`
- 環境変数: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- volume でデータ永続化

### 2. 環境変数ファイル

`.env.example` を作成:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/issue_tracker?schema=public"
```

`.env` にコピーして使う（`.gitignore` に `.env` を追加）。

### 3. Prisma 導入

```bash
pnpm add prisma @prisma/client
npx prisma init
```

これにより `prisma/schema.prisma` と `.env` が生成される。

### 4. スキーマ定義

`prisma/schema.prisma` にIssueモデルを記述:

- `id`: String, cuid, @id
- `title`: String
- `description`: String? (nullable)
- `status`: String, default "open"
- `createdAt`: DateTime, default now()
- `updatedAt`: DateTime, @updatedAt

### 5. マイグレーション実行

```bash
docker compose up -d
pnpm prisma migrate dev --name init
```

### 6. 動作確認

```bash
pnpm prisma studio    # ブラウザでDBを確認
# または
docker compose exec db psql -U postgres -d issue_tracker -c '\dt'
```

## 完了状態

```
docker-compose.yml
.env.example
.env              (gitignore対象)
.gitignore
prisma/
├── schema.prisma
└── migrations/
    └── <timestamp>_init/
        └── migration.sql
```
