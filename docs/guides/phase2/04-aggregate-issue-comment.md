# 04: Aggregate — Issue + Comment

対応Issue: #26

---

## 原則: Aggregate（集約）とは何か

### 定義

Aggregate（集約）とは、**複数のオブジェクトをひとまとめにし、整合性を保証する境界**です。

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│  Aggregate の3つの要素                                 │
│                                                       │
│  1. Aggregate Root（集約ルート）                       │
│     → 外部からのアクセス窓口。この中の子には直接触れない  │
│                                                       │
│  2. 子エンティティ / 子 Value Object                   │
│     → Root を経由してのみ操作される                     │
│                                                       │
│  3. 整合性の境界                                       │
│     → この中のルールは、Root が責任を持って守る          │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### 現実世界の例え

**注文書（Order）と明細行（OrderLine）** を考えてみてください。

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│  注文書 (Aggregate Root)                              │
│  ┌─────────────────────────────────────────────┐     │
│  │ 注文番号: A-001                              │     │
│  │ 顧客: 山田太郎                                │     │
│  │ 合計: 3,500円                                │     │
│  │                                              │     │
│  │ 明細行1: りんご × 3 = 900円                   │     │
│  │ 明細行2: みかん × 5 = 1,500円                 │     │
│  │ 明細行3: ぶどう × 1 = 1,100円                 │     │
│  │          ──────────────                       │     │
│  │                合計 = 3,500円  ← 整合性!      │     │
│  └─────────────────────────────────────────────┘     │
│                                                       │
│  ❌ 明細行だけを直接変更すると、合計と矛盾する           │
│  ✅ 注文書を通して明細を操作すれば、合計が自動で更新     │
│                                                       │
└──────────────────────────────────────────────────────┘
```

もし明細行2を勝手に「みかん × 10 = 3,000円」に変更したら？
合計は3,500円のまま。**整合性が壊れます**。

注文書（Aggregate Root）を通して操作すれば：
1. 明細行を変更する
2. 合計を再計算する

この2つが**必ずセットで実行**されます。

### Entity / Value Object との関係

```
┌───────────────────────────────────────────────────────┐
│                                                        │
│  Value Object:  一つの「値」の正しさを守る               │
│                 (IssueTitle, IssueId)                   │
│                                                        │
│  Entity:        一つの「モノ」の状態遷移の正しさを守る    │
│                 (Issue の close/reopen)                  │
│                                                        │
│  Aggregate:     複数の「モノ」の間の整合性を守る          │
│                 (Issue + Comment の整合性)               │
│                                                        │
│  ┌─────┐                                               │
│  │VO   │  ⊂  ┌──────┐  ⊂  ┌───────────┐              │
│  │(値) │     │Entity │     │ Aggregate  │              │
│  └─────┘     │(個体) │     │ (集合体)    │              │
│              └──────┘     └───────────┘              │
│                                                        │
│  守る範囲が広がっていく                                  │
│                                                        │
└───────────────────────────────────────────────────────┘
```

### Aggregate の重要なルール

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│  ルール1: 外部からは Root を通してのみアクセスする       │
│                                                       │
│    ✅ issue.addComment("素晴らしい！")                 │
│    ❌ commentRepository.save(comment)  ← 直接操作NG    │
│                                                       │
│  ルール2: Root が子の整合性を保証する                    │
│                                                       │
│    Issue が closed のとき → コメント追加を拒否           │
│    → この判断は Issue (Root) が行う                     │
│                                                       │
│  ルール3: 1トランザクション = 1 Aggregate               │
│                                                       │
│    Issue と Comment は同じトランザクションで保存する      │
│    別の Aggregate（例: User）とは別トランザクション      │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## このリポジトリの問題

### 現状: Issue しかない

今は Issue 1つだけなので、Aggregate の必要性は顕在化していません。
しかし **Issue にコメント機能を追加**すると、問題が見えてきます。

### もし Aggregate なしでコメントを追加すると？

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  Aggregate なしの設計                                     │
│                                                           │
│  IssueRepository.findById(id)                             │
│  CommentRepository.findByIssueId(issueId)                 │
│  CommentRepository.save(comment)                          │
│                                                           │
│  問題:                                                    │
│                                                           │
│  ❌ closed な Issue にコメントできてしまう                  │
│     → UseCase で Issue の status を確認する？               │
│     → でも別の UseCase からもコメント追加するなら？          │
│     → チェック漏れが起きる                                 │
│                                                           │
│  ❌ Issue を削除してもコメントが残る                        │
│     → CommentRepository.deleteByIssueId() を忘れたら？     │
│     → 孤立したコメントが DB に残る                         │
│                                                           │
│  ❌ コメント数の上限を誰が管理する？                        │
│     → UseCase A でチェック、UseCase B では忘れる            │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Aggregate ありなら

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  Aggregate ありの設計                                     │
│                                                           │
│  issueRepository.findById(id)                             │
│    → Issue + Comment[] をまとめて取得                      │
│                                                           │
│  issue.addComment("素晴らしい！")                          │
│    → Issue 自身が「closed なら拒否」を判断                  │
│    → Issue 自身が「コメント数上限」を判断                   │
│                                                           │
│  issueRepository.save(issue)                               │
│    → Issue + Comment[] をまとめて保存                      │
│                                                           │
│  ✅ 整合性ルールが Issue (Root) に閉じている                │
│  ✅ Issue を削除すれば Comment も一緒に消える               │
│  ✅ どの UseCase からでも同じルールが適用される              │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 実装ステップ

### 1. Comment エンティティを作る

`src/domain/issue/comment.ts`:

```
┌───────────────────────────────────┐
│  Comment                          │
│                                   │
│  - id: CommentId     (readonly)   │
│  - body: string      (readonly)   │
│  - createdAt: Date   (readonly)   │
│                                   │
│  + static create(body: string)    │
│  + static reconstruct(...)        │
│                                   │
└───────────────────────────────────┘
```

- [ ] Comment は Issue の子エンティティ
- [ ] Comment は Issue を経由してのみ操作される
- [ ] CommentRepository は作らない（Issue と一緒に保存される）

### 2. Issue に Comment 管理メソッドを追加する

```
┌──────────────────────────────────────────────┐
│  Issue (Aggregate Root)                       │
│                                               │
│  既存:                                        │
│  - close() / reopen()                         │
│                                               │
│  追加:                                        │
│  - addComment(body: string): Comment          │
│    → closed なら拒否                           │
│    → Comment を生成して内部リストに追加          │
│  - getComments(): readonly Comment[]          │
│    → コメント一覧を返す（直接変更不可）          │
│                                               │
└──────────────────────────────────────────────┘
```

### 3. IssueRepository を修正する

```
Before:  save(issue: Issue)  → Issue のみ保存
After:   save(issue: Issue)  → Issue + Comment[] をまとめて保存
```

Repository は Aggregate 単位で保存する。
Comment 用の別 Repository は作らない。

### 4. ドメインエラーを追加する

- [ ] `CannotCommentOnClosedIssueError`: closed な Issue にコメントしようとした

### 5. テストを書く

`tests/domain/issue/entity.test.ts` に追加:
- [ ] 正常系: open な Issue にコメントを追加できる
- [ ] 正常系: 追加したコメントが getComments() で取得できる
- [ ] 異常系: closed な Issue にコメント追加 → エラー

`tests/fakes/fakeIssueRepository.test.ts` を修正:
- [ ] Issue + Comment がまとめて保存・取得されることを確認

### 6. Fake Repository を修正する

Comment も含めて保存・復元する。
Issue を保存するとき、Comment リストもまるごと保持する。

## 設計ポイント

- **CommentRepository を作らない**のが Aggregate の核心
  - Comment は Issue を経由してのみアクセスする
  - 保存も Issue と一緒（1トランザクション）
- Aggregate Root（Issue）が整合性のガーディアン
  - 「closed ならコメント不可」は Issue が判断する
  - UseCase は `issue.addComment()` を呼ぶだけ
- DB スキーマでは Comment テーブルは別でも OK
  - DB設計とドメイン設計は分離して良い
  - Infra 層で Issue + Comment をまとめて取得・保存する

## 完了状態

```
src/domain/issue/
├── comment.ts       # 🆕 子エンティティ
├── entity.ts        # addComment() / getComments() 追加
├── errors.ts        # CannotCommentOnClosedIssueError 追加
├── issueId.ts
├── issueTitle.ts
└── repository.ts    # Comment も含めて保存するように修正
tests/domain/issue/
├── entity.test.ts   # コメント追加のテスト追加
├── issueId.test.ts
└── issueTitle.test.ts
```
