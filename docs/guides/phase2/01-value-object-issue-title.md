# 01: Value Object — IssueTitle

対応Issue: #23

---

## 原則: Value Object とは何か

### 定義

Value Object（値オブジェクト）とは、**同一性（ID）を持たず、値そのもので比較される不変のオブジェクト**です。

```
┌─────────────────────────────────────────────────┐
│  Value Object の3つの性質                        │
│                                                  │
│  1. 不変（Immutable）                            │
│     → 一度作ったら変更できない。変えたいなら新しく作る │
│                                                  │
│  2. 値で比較（Equality by Value）                 │
│     → 中身が同じなら同じもの                       │
│                                                  │
│  3. 自己検証（Self-Validating）                   │
│     → 不正な値では作れない。存在＝正しい             │
│                                                  │
└─────────────────────────────────────────────────┘
```

### 現実世界の例え

**お金**を考えてみてください。

- 1000円玉 A と 1000円玉 B があっても、どちらも「1000円」として同じ価値です（値で比較）
- 1000円玉に「500」と書き換えることはできません（不変）
- 「マイナス100円玉」は存在しません（自己検証）

他の例:

- **メールアドレス**: `user@example.com` は形式が正しくないと作れない
- **住所**: 都道府県・市区町村・番地の組み合わせ。中身が同じなら同じ住所
- **色**: RGB(255, 0, 0) と RGB(255, 0, 0) は同じ「赤」

### Entity との違い

ここが非常に重要です。

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   Entity（エンティティ）          Value Object（値オブジェクト）│
│                                                          │
│   ・IDで区別する                  ・値で区別する              │
│   ・同じ名前の人が2人いても       ・1000円と1000円は           │
│     別人（IDが違う）               同じもの（値が同じ）        │
│   ・状態が変わっても同じもの      ・変更不可。新しく作る        │
│     （名前が変わっても同じ人）                                │
│   ・ライフサイクルがある          ・ライフサイクルがない        │
│     （生成→変更→削除）            （作る→使う→捨てる）        │
│                                                          │
│   例: ユーザー、注文、Issue       例: お金、住所、メールアドレス│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**判断基準:** 「同じ内容の2つを区別する必要があるか？」

- YES → Entity（例: 同じタイトルの Issue が2つあっても別物）
- NO → Value Object（例: 同じタイトル文字列は同じ意味）

### なぜ Value Object を使うのか

素の `string` や `number` をそのまま使うと、以下の問題が起きます:

```
┌─────────────────────────────────────────────────────┐
│  素のstring を使うと...                               │
│                                                      │
│  ❌ どこでもバリデーションが必要                        │
│     → CreateIssue でチェック                          │
│     → UpdateIssue でも同じチェック（コピペ）            │
│     → 3つ目の UseCase でもまたコピペ...                │
│                                                      │
│  ❌ 型が意味を持たない                                 │
│     → title: string, description: string              │
│     → 取り違えてもコンパイルエラーにならない             │
│                                                      │
│  ❌ ルールが散らばる                                   │
│     → 「タイトルは空文字禁止」はどこに書いてある？       │
│     → コードベースを検索しないとわからない               │
│                                                      │
│                    ↓ Value Object を使うと             │
│                                                      │
│  ✅ バリデーションは1箇所（VOの中）                     │
│  ✅ 型が意味を持つ（IssueTitle ≠ string）              │
│  ✅ ルールがコードとして明示される                       │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## このリポジトリの問題

### 現状のコード

`src/usecase/issue/createIssue.ts` を見てください:

```typescript
// UseCase の中にバリデーションロジックがある
const trimmed = input.title.trim();
if (trimmed === "") {
  throw new InvalidIssueTitleError();
}
```

**問題1: バリデーションの散らばり**

UpdateIssue UseCase でもタイトルを変更できます。同じバリデーションをコピペする必要があります。
3つ目、4つ目の UseCase が増えるたびにコピペが増えます。

**問題2: 「タイトルとは何か」がコードに表現されていない**

今の Entity 定義:

```typescript
type Issue = {
  id: string; // ← ただの string
  title: string; // ← ただの string。何文字まで？空文字OK？
  description: string;
  status: "open" | "closed";
  createdAt: Date;
  updatedAt: Date;
};
```

`title: string` からは「空文字禁止」というルールは読み取れません。
将来「100文字以内」というルールが追加されたとき、修正すべき箇所を全部見つけられますか？

**問題3: 型の取り違え**

`id` も `title` も `description` も全部 `string` です。
関数の引数を間違えて渡してもコンパイルエラーになりません。

```typescript
// コンパイルは通るが、意味的に間違い
findByTitle(issue.id); // id を渡してしまった！
```

---

## 実装ステップ

### 1. IssueTitle Value Object を作る

`src/domain/issue/issueTitle.ts`:

- [ ] クラスとして実装する
- [ ] コンストラクタで自己検証（空文字チェック、trim）
- [ ] `value` プロパティで内部の文字列を取得できるようにする
- [ ] 不変にする（`readonly`）

```
┌─────────────────────────────────────┐
│  IssueTitle                         │
│                                     │
│  + constructor(value: string)       │
│    → trim する                      │
│    → 空文字なら InvalidIssueTitleError│
│  + readonly value: string           │
│  + equals(other: IssueTitle): boolean│
│                                     │
└─────────────────────────────────────┘
```

### 2. Entity の型を変更する

```
Before:  title: string
After:   title: IssueTitle
```

### 3. CreateIssueUsecase からバリデーションを削除する

UseCase のバリデーションロジックを消し、代わりに `new IssueTitle(input.title)` と書くだけにする。
IssueTitle のコンストラクタが不正な値を弾いてくれる。

### 4. テストを書く

`tests/domain/issue/issueTitle.test.ts`:

- [ ] 正常系: 有効なタイトル文字列で作成できる
- [ ] 正常系: 前後の空白が trim される
- [ ] 異常系: 空文字で `InvalidIssueTitleError` が throw される
- [ ] 異常系: 空白のみで `InvalidIssueTitleError` が throw される
- [ ] 等価性: 同じ値の IssueTitle 同士が `equals()` で true を返す

既存の UseCase テストも修正する（IssueTitle を使うように）。

### 5. Fake Repository を修正する

Entity の型が変わるので、Fake Repository の内部実装も合わせる。

## 設計ポイント

- Value Object はドメイン層に置く（`src/domain/issue/`）
- UseCase は Value Object を「使う」だけ。バリデーションロジックを持たない
- Value Object のコンストラクタが throw する = **不正な値は存在できない**
- これにより「IssueTitle 型の値が存在する = 有効なタイトルである」が保証される

## 完了状態

```
src/domain/issue/
├── entity.ts        # title: string → title: IssueTitle に変更
├── errors.ts        # 既存のまま
├── issueTitle.ts    # 🆕 Value Object
└── repository.ts    # 既存のまま
tests/domain/issue/
└── issueTitle.test.ts  # 🆕 VO のテスト
```
