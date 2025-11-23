# Backend - E-Commerce Mock API

FastAPI を使用した E-Commerce のバックエンド API です。

## クイックスタート

### 依存関係のインストール

```bash
# 本番用依存関係
pip install -r requirements.txt

# 開発用依存関係（ruff, black, mypy）
pip install -r requirements-dev.txt
```

### 開発サーバーの起動

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## コード品質ツール

### 利用可能なコマンド

```bash
# すべてのコマンドを表示
make help

# コードのフォーマット（ruff + black）
make format

# リンティング（ruff）
make lint

# 型チェック（mypy）
make type-check

# すべてのチェックを実行
make check

# キャッシュファイルの削除
make clean
```

### 個別実行

```bash
# Ruff でリンティング
ruff check app/

# Ruff で自動修正
ruff check --fix app/

# Black でフォーマット
black app/

# Black でチェックのみ
black --check app/

# Mypy で型チェック
mypy app/
```

## プロジェクト構造

```
backend/
├── app/
│   ├── api/              # API エンドポイント
│   ├── db/               # データベース設定
│   ├── models/           # SQLAlchemy モデル
│   ├── schemas/          # Pydantic スキーマ
│   ├── services/         # ビジネスロジック
│   └── main.py           # アプリケーションエントリーポイント
├── scripts/              # ユーティリティスクリプト
├── requirements.txt      # 本番用依存関係
├── requirements-dev.txt  # 開発用依存関係
├── pyproject.toml        # ツール設定
├── Makefile              # 便利なコマンド
└── DEVELOPMENT.md        # 開発ガイド
```

## 詳細なドキュメント

詳細な開発ガイドは [DEVELOPMENT.md](./DEVELOPMENT.md) を参照してください。
