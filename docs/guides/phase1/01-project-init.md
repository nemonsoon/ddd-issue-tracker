# 01: プロジェクト初期化

対応Issue: #1

## 手順

### 1. pnpm 初期化

```bash
pnpm init
```

`package.json` が生成される。`name`, `version`, `type: "module"` を確認・追記。

### 2. TypeScript 導入

```bash
pnpm add -D typescript @types/node
npx tsc --init
```

`tsconfig.json` の重要設定:

| 項目 | 値 | 理由 |
|------|-----|------|
| `strict` | `true` | 型安全性の基盤 |
| `target` | `ES2023` | Node.js 24が対応する最新ES仕様 |
| `module` | `Node16` or `NodeNext` | ESM + Node.js解決アルゴリズム |
| `moduleResolution` | `Node16` or `NodeNext` | 上記に対応 |
| `outDir` | `./dist` | ビルド出力先 |
| `rootDir` | `./src` | ソースルート |
| `skipLibCheck` | `true` | node_modules内の型チェックスキップ |

### 3. Biome 導入

```bash
pnpm add -D @biomejs/biome
npx @biomejs/biome init
```

`biome.json` で設定する項目:
- formatter: インデント(tab or space)、行幅
- linter: recommended ルールセット有効化
- organizeImports: 有効化

### 4. Vitest 導入

```bash
pnpm add -D vitest
```

`vitest.config.ts` を作成:
- テスト対象のglobパターン (`tests/**/*.test.ts`)
- TypeScriptパス解決（必要なら）

### 5. npm scripts 定義

`package.json` に追加:

```json
{
  "scripts": {
    "dev": "tsx src/main.ts",
    "build": "tsc",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "test": "vitest run"
  }
}
```

`tsx` は開発時のTS実行に使う:

```bash
pnpm add -D tsx
```

### 6. ディレクトリ作成

```bash
mkdir -p src tests
```

### 7. 動作確認

```bash
pnpm tsc --noEmit     # エラー0
pnpm lint             # エラー0
pnpm test             # テストファイルなしでもエラーにならないこと
```

## 完了状態

```
package.json
tsconfig.json
biome.json
vitest.config.ts
src/
tests/
node_modules/
pnpm-lock.yaml
```
