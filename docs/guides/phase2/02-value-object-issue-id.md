# 02: Value Object — IssueId

対応Issue: #24

---

## 原則: なぜ ID も Value Object にするのか

### 前回の復習

Value Object の3つの性質:

1. **不変**（一度作ったら変更しない）
2. **値で比較**（中身が同じなら同じもの）
3. **自己検証**（不正な値では作れない）

IssueTitle で「バリデーションの一元化」を学びました。
IssueId ではもう一つの重要な効果、**型による取り違え防止**を学びます。

### 素の string の危険性

```
┌───────────────────────────────────────────────────────┐
│  全部 string だと何が起きるか                            │
│                                                        │
│  issueId:   "550e8400-e29b-41d4-a716-446655440000"     │
│  userId:    "7c9e6679-7425-40de-944b-e07fc1f90ae7"     │
│  commentId: "f47ac10b-58cc-4372-a567-0e02b2c3d479"     │
│                                                        │
│  ↑ 全部 string 型。どれがどれか、型システムは区別できない    │
│                                                        │
│  repository.findById(userId)  // ← コンパイル通る！バグ！│
│                                                        │
└───────────────────────────────────────────────────────┘
```

### 現実世界の例え

**マイナンバーとパスポート番号**を考えてみてください。

どちらも「数字の列」ですが、意味が全く違います。
マイナンバーの欄にパスポート番号を書いたら大問題ですよね。

でも紙の上では両方とも「数字の列」です。人間が注意して区別するしかない。
型システムなら、**コンパイル時に間違いを検出**できます。

```
┌──────────────────────────────────────────────────┐
│                                                   │
│  string を使う場合:                                │
│    マイナンバー欄にパスポート番号を書いても          │
│    「文字列ですね、OK」と受理される                  │
│                                                   │
│  Value Object を使う場合:                          │
│    マイナンバー欄にパスポート番号を入れようとすると   │
│    「型が違います！」とコンパイルエラー              │
│                                                   │
└──────────────────────────────────────────────────┘
```

### IssueTitle との違い

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│   IssueTitle の主な価値:                               │
│     バリデーションの一元化                              │
│     「空文字禁止」「100文字以内」などのルール            │
│                                                       │
│   IssueId の主な価値:                                  │
│     型による取り違え防止                                │
│     IssueId と UserId を混同できなくする                │
│     + ID形式の検証（UUID形式か？空文字でないか？）       │
│                                                       │
│   どちらも Value Object だが、                         │
│   解決する問題の重心が異なる                             │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## このリポジトリの問題

### 現状のコード

```typescript
type Issue = {
  id: string; // ← ただの string
  // ...
};
```

```typescript
// UseCase で ID を生成
const issue: Issue = {
  id: crypto.randomUUID(),
  // ...
};
```

**問題1: ID の生成場所が散らばるリスク**

今は CreateIssueUsecase だけが ID を生成していますが、将来別の場所で ID を生成する必要が出たら？
UUID 形式の統一が保証されません。

**問題2: 型の取り違えが検出できない**

```typescript
// 将来 User や Comment が増えたとき...
issueRepository.findById(userId); // string 同士なので通ってしまう
```

**問題3: ID の形式が明示されていない**

「Issue の ID は UUID 形式」というルールが、コード上に明示されていません。
`crypto.randomUUID()` を使っている箇所を見ないとわからない。

---

## 実装ステップ

### 1. IssueId Value Object を作る

`src/domain/issue/issueId.ts`:

```
┌─────────────────────────────────────┐
│  IssueId                            │
│                                     │
│  + constructor(value: string)       │
│    → 空文字チェック                   │
│  + static generate(): IssueId       │
│    → crypto.randomUUID() で新規生成  │
│  + readonly value: string           │
│  + equals(other: IssueId): boolean  │
│                                     │
└─────────────────────────────────────┘
```

ポイント:

- `constructor` は既存の ID 文字列から復元する（DBからの読み取り時）
- `static generate()` は新しい ID を生成する（新規作成時）
- この2つを分けることで、ID 生成のルールが一箇所にまとまる

### 2. Entity の型を変更する

```
Before:  id: string
After:   id: IssueId
```

### 3. CreateIssueUsecase を修正する

```
Before:  id: crypto.randomUUID()
After:   id: IssueId.generate()
```

ID 生成が UseCase から IssueId に移る。UseCase は「新しい ID を作る」という意図だけ表現する。

### 4. Repository インターフェースを修正する

```
Before:  findById(id: string): Promise<Issue | null>
After:   findById(id: IssueId): Promise<Issue | null>
```

これにより `findById` に IssueId 以外の string を渡すとコンパイルエラーになる。

### 5. テストを書く

`tests/domain/issue/issueId.test.ts`:

- 正常系: 文字列から IssueId を生成できる
- 正常系: `generate()` で新しい IssueId が作られる
- 異常系: 空文字でエラーが throw される
- 等価性: 同じ値の IssueId 同士が `equals()` で true を返す
- 一意性: `generate()` を2回呼ぶと異なる ID が生成される

### 6. Fake Repository・既存テストを修正する

Entity と Repository の型が変わるので、Fake と既存テストを合わせる。

## 設計ポイント

- `generate()` を static メソッドにすることで、「新規生成」と「既存IDの復元」を明確に区別する
- Repository の引数が `IssueId` になることで、間違った型の ID を渡すとコンパイルエラーになる
- 将来 `UserId` や `CommentId` を追加したとき、型レベルで取り違えが防止される

## 完了状態

```
src/domain/issue/
├── entity.ts        # id: string → id: IssueId に変更
├── errors.ts
├── issueId.ts       # 🆕 Value Object
├── issueTitle.ts    # 前回追加済み
└── repository.ts    # findById(id: string) → findById(id: IssueId)
tests/domain/issue/
├── issueId.test.ts  # 🆕 VO のテスト
└── issueTitle.test.ts
```
