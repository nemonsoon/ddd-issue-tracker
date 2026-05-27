# 06: Fake Repository 実装

対応Issue: #6

## 手順

### 1. ディレクトリ作成

```bash
mkdir -p tests/fakes
```

### 2. FakeIssueRepository 実装

`tests/fakes/fakeIssueRepository.ts`:
- `IssueRepository` interface をimportして実装する
- 内部ストレージ: `Map<string, Issue>`
- 全メソッドをインメモリで実装:
  - `save`: Map に追加して返す
  - `findById`: Map.get
  - `findAll`: Map.values をフィルタ、limit/offset 適用
  - `update`: Map に上書き
  - `delete`: Map.delete

### 3. 簡易テストで動作確認

`tests/fakes/fakeIssueRepository.test.ts`:
- save → findById で取得できること
- findById で存在しないID → null
- delete → findById で null

```bash
pnpm test
```

## 設計ポイント

- Fake は **インターフェースの本物の実装** （振る舞いを再現する）
- Mock は **呼び出しの記録と検証** （実装を持たない）
- Fake でテストすることで「Repository の使い方が正しいか」を検証できる
- テスト間でデータが漏れないよう、各テスト前に Map をクリアする仕組みを用意

## 完了状態

```
tests/
└── fakes/
    ├── fakeIssueRepository.ts       # Fake実装
    └── fakeIssueRepository.test.ts  # 動作確認テスト
```
