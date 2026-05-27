# 07: UseCase層 — CreateIssue + 単体テスト

対応Issue: #7

## 手順

### 1. ディレクトリ作成

```bash
mkdir -p src/usecase/issue tests/usecase/issue
```

### 2. CreateIssue UseCase 実装

`src/usecase/issue/createIssue.ts`:

- クラスまたは関数で実装
- コンストラクタ（またはファクトリ引数）で `IssueRepository` を受け取る
- 入力: `{ title: string, description?: string }`
- 処理:
  1. title のバリデーション（空文字チェック）
  2. Issue オブジェクト生成（id生成、status: "open"、タイムスタンプ）
  3. repository.save() で保存
  4. 保存した Issue を返す

### 3. ID生成

- `cuid` や `crypto.randomUUID()` を使う
- Node.js 組み込みの `crypto.randomUUID()` が最もシンプル
- ただし Prisma 側で `@default(cuid())` を使うなら、UseCase で生成するか DB に任せるか判断が必要

### 4. 単体テスト

`tests/usecase/issue/createIssue.test.ts`:

- FakeIssueRepository を注入
- 正常系: title を渡して Issue が返ること、status が "open" であること
- 異常系: title が空文字でエラーが throw されること

```bash
pnpm test
```

## 設計ポイント

- UseCase は「何をするか」を調整するだけ。ロジック自体は薄い
- Repository interface に依存し、具体実装（Prisma）を知らない
- ID を UseCase で生成するか DB に委ねるかはトレードオフ:
  - UseCase生成: テストしやすい、DB非依存
  - DB生成: cuid/uuid の重複リスクなし、Prisma の default に任せられる

## 完了状態

```
src/usecase/issue/
└── createIssue.ts
tests/usecase/issue/
└── createIssue.test.ts
```
