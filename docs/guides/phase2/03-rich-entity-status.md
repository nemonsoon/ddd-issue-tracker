# 03: Rich Entity — ステータス遷移

対応Issue: #17

---

## 原則: Rich Entity とは何か

### Anemic Domain Model vs Rich Domain Model

Phase 1 では Entity を**型定義だけ**で表現しました。これを **Anemic Domain Model（貧血ドメインモデル）** と呼びます。

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Anemic Domain Model（Phase 1 の状態）                   │
│                                                          │
│  ┌─────────────┐     ┌──────────────────┐               │
│  │ Issue (型)   │     │ UseCase          │               │
│  │              │     │                  │               │
│  │ id: string   │     │ issue.status =   │               │
│  │ title: string│     │   "closed"       │               │
│  │ status: ...  │     │ // ルールはここ   │               │
│  │              │     │                  │               │
│  │ ※メソッドなし │     │ ※ロジックがここに │               │
│  └─────────────┘     │  集まる          │               │
│                       └──────────────────┘               │
│                                                          │
│  → Entity はただのデータ入れ物                            │
│  → ビジネスルールが UseCase に散らばる                     │
│                                                          │
└──────────────────────────────────────────────────────────┘

                        ↓ リファクタリング

┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Rich Domain Model（Phase 2 のゴール）                   │
│                                                          │
│  ┌──────────────────┐     ┌──────────────────┐          │
│  │ Issue (クラス)     │     │ UseCase          │          │
│  │                   │     │                  │          │
│  │ close()           │     │ issue.close()    │          │
│  │  → "open" のとき   │     │ // 呼ぶだけ      │          │
│  │    だけ閉じられる   │     │                  │          │
│  │ reopen()          │     │ ※ルールは持たない  │          │
│  │  → "closed" のとき │     │                  │          │
│  │    だけ開ける       │     │                  │          │
│  │                   │     │                  │          │
│  │ ※ルールを自分で守る │     │                  │          │
│  └──────────────────┘     └──────────────────┘          │
│                                                          │
│  → Entity が自分のルールを知っている                       │
│  → UseCase は「何をするか」を調整するだけ                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 現実世界の例え

**自動販売機**を考えてみてください。

Anemic な自販機:

- 自販機はただの箱（データ入れ物）
- 「お金が足りているか」「在庫があるか」は外のコントローラーが判断する
- コントローラーが壊れたら、お金なしでジュースが出てくる

Rich な自販機:

- 自販機自身が「お金が足りているか」「在庫があるか」を判断する
- 外から「買う」と言われても、条件を満たさなければ拒否する
- **自分のルールは自分で守る**

### Value Object との違い

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│  Value Object:                                        │
│    「値の正しさ」を守る                                  │
│    → IssueTitle は空文字を拒否する                      │
│    → 一度作ったら変わらない（不変）                      │
│                                                       │
│  Rich Entity:                                         │
│    「状態遷移の正しさ」を守る                             │
│    → Issue は不正なステータス変更を拒否する               │
│    → 状態が変わる（可変）が、ルールに従って変わる          │
│                                                       │
│  Value Object = 「作るとき」のガード                     │
│  Rich Entity  = 「変わるとき」のガード                   │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### なぜ Rich Entity を使うのか

```
┌─────────────────────────────────────────────────────┐
│  Anemic Model だと...                                │
│                                                      │
│  ❌ ステータス変更のルールが UseCase に散らばる          │
│     → UpdateIssueUsecase に書く？                     │
│     → CloseIssueUsecase にも書く？                    │
│     → API の Controller にも書く？                    │
│                                                      │
│  ❌ ルールの変更時に修正箇所が多い                      │
│     → 「closed から reopen 禁止」を追加するとき         │
│     → すべての UseCase を探して修正する必要がある        │
│                                                      │
│  ❌ ルールを破るコードが書ける                          │
│     → issue.status = "closed" とどこからでも書ける     │
│     → テストでは正しくても本番で壊れる                  │
│                                                      │
│                    ↓ Rich Entity にすると              │
│                                                      │
│  ✅ ルールは Entity の中に1箇所                         │
│  ✅ issue.close() を呼ぶだけ。ルールは Entity が守る     │
│  ✅ 不正な遷移はコンパイル時 or 実行時に弾かれる         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## このリポジトリの問題

### 現状のコード

Entity はただの型定義:

```typescript
type Issue = {
  id: string;
  title: string;
  description: string;
  status: "open" | "closed";
  createdAt: Date;
  updatedAt: Date;
};
```

UpdateIssueUsecase（Phase 1 で作成予定）では:

```typescript
// status を直接上書きできてしまう
const updated = {
  ...issue,
  status: input.status, // "open" → "closed" でも "closed" → "open" でも何でもOK
  updatedAt: new Date(),
};
```

**問題: ステータス遷移にルールがない**

もし以下のビジネスルールがあったら？

- 「open → closed は可能」
- 「closed → open への再オープンは可能」
- 将来「resolved」ステータスが追加されたら？ 遷移ルールはどんどん複雑になる

今の設計では、このルールを **Entity の外** に書くしかありません。

---

## 実装ステップ

### 1. Issue を型定義からクラスに変える

`src/domain/issue/entity.ts`:

```
┌───────────────────────────────────────────┐
│  Issue (class)                            │
│                                           │
│  - id: IssueId              (readonly)    │
│  - title: IssueTitle         (readonly)   │
│  - description: string       (readonly)   │
│  - status: "open" | "closed" (private)    │
│  - createdAt: Date           (readonly)   │
│  - updatedAt: Date           (private)    │
│                                           │
│  + static create(...)        新規作成      │
│  + static reconstruct(...)   DB復元        │
│  + close(): void             open→closed  │
│  + reopen(): void            closed→open  │
│  + getStatus(): string       status参照    │
│                                           │
└───────────────────────────────────────────┘
```

ポイント:

- `static create()`: 新規 Issue 作成（ID 生成、status を "open" に固定）
- `static reconstruct()`: DB から読み込んだデータで復元（バリデーション不要）
- `close()`: status が "open" でなければエラーを throw
- `reopen()`: status が "closed" でなければエラーを throw

### 2. ドメインエラーを追加する

`src/domain/issue/errors.ts` に追加:

- `InvalidStatusTransitionError`: 不正なステータス遷移を表すエラー
  - メッセージ例: `Cannot transition from "closed" to "closed"`

### 3. UseCase を修正する

```
Before:  const updated = { ...issue, status: input.status }
After:   issue.close()  // Entity のメソッドを呼ぶだけ
```

UseCase は Entity に「何をしたいか」を伝えるだけ。
ルールの判断は Entity が行う。

### 4. テストを書く

`tests/domain/issue/entity.test.ts`:

- 正常系: open な Issue を close() できる
- 正常系: closed な Issue を reopen() できる
- 異常系: すでに closed な Issue を close() → エラー
- 異常系: すでに open な Issue を reopen() → エラー
- 生成: `Issue.create()` で status が "open" になる

### 5. create() と reconstruct() の使い分けを反映する

- CreateIssueUsecase → `Issue.create()`
- GetIssueUsecase / Fake Repository → `Issue.reconstruct()`

## 設計ポイント

- `create()` と `reconstruct()` を分けるのは、**新規作成と復元は意味が異なる**から
  - `create()`: ビジネスルールを適用（status は必ず "open"）
  - `reconstruct()`: DB の値をそのまま使う（過去に作られたデータを信頼する）
- `status` を `private` にすることで、外部から直接変更できなくなる
- ステータス遷移のルールが **Entity の中に閉じ込められる**
- UseCase のテストでは「Entity のメソッドが呼ばれた結果」をテストする

## 完了状態

```
src/domain/issue/
├── entity.ts        # type → class に変更。close() / reopen() メソッド追加
├── errors.ts        # InvalidStatusTransitionError 追加
├── issueId.ts
├── issueTitle.ts
└── repository.ts
tests/domain/issue/
├── entity.test.ts   # 🆕 ステータス遷移のテスト
├── issueId.test.ts
└── issueTitle.test.ts
```
