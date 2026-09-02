# アーキテクチャ

[← README](../README.md)

層の実装に入る前に読む。層ごとの責務と、リクエストがどの順で層を通るかを扱う。

## オニオンアーキテクチャ

Domain を中心に据え、外側の層が内側のインターフェースに依存する（依存性逆転）。

```mermaid
graph TD
    subgraph "外側: Infrastructure"
        DB[(PostgreSQL)]
        Prisma[Prisma ORM]
    end

    subgraph "外側: Presentation"
        HTTP[Hono + Zod]
    end

    subgraph "内側: Application"
        UC[UseCase]
    end

    subgraph "最内側: Domain"
        Entity[Entity]
        Repo[Repository Interface]
        Err[Domain Errors]
    end

    HTTP --> UC
    UC --> Entity
    UC --> Repo
    Prisma -.->|implements| Repo
    Prisma --> DB
```

## 層の責務

| 層                 | 位置   | 責務                                             | 依存先                 |
| ------------------ | ------ | ------------------------------------------------ | ---------------------- |
| **Domain**         | 最内側 | Entity型、Repository interface、ドメインエラー   | なし（純粋TypeScript） |
| **UseCase**        | 中間   | ビジネスフロー調整、アプリケーションエラー（`IssueNotFoundError` 等）、1ファイル1ユースケース | Domain                 |
| **Infrastructure** | 外側   | データベースとの通信、Repository interfaceの実装 | Domain, Prisma         |
| **Presentation**   | 外側   | HTTPルーティング、バリデーション、レスポンス整形 | UseCase, Zod           |

## 依存方向

依存の向きを表す図は [README](../README.md#アーキテクチャ) にある。

**核心原則**: Domain層は一切の外部依存を持たない。外側の層がDomainのインターフェースに依存する。データベースやフレームワークの差し替えがドメインロジックに影響しない。

## リクエスト/レスポンスフロー

```mermaid
sequenceDiagram
    participant C as Client
    participant P as Presentation<br/>(Hono)
    participant U as UseCase
    participant R as Repository<br/>(Prisma実装)
    participant DB as PostgreSQL

    C->>P: HTTP Request
    P->>P: Zod バリデーション
    P->>U: UseCase実行
    U->>R: Repository メソッド呼び出し
    R->>DB: SQL Query
    DB-->>R: Raw Data
    R-->>U: Domain Entity
    U-->>P: Entity or Error (アプリ/ドメイン)
    P-->>C: HTTP Response (JSON)
```
