# Backend Development Guide

## Code Quality Tools

このプロジェクトでは、コード品質と型安全性を確保するために以下のツールを使用しています：

### ツール

- **Ruff**: 高速なPythonリンター（Flake8、isort、pyupgradeなどの代替）
- **Black**: コードフォーマッター
- **Mypy**: 静的型チェッカー

## セットアップ

### 開発用依存関係のインストール

```bash
# 通常の依存関係
pip install -r requirements.txt

# 開発用依存関係
pip install -r requirements-dev.txt

# または Makefile を使用
make install-dev
```

## 使用方法

### コードのフォーマット

```bash
# Makefile を使用（推奨）
make format

# または個別に実行
ruff check --fix app/
black app/

# またはスクリプトを使用
./scripts/format.sh
```

### リンティング

```bash
# Makefile を使用
make lint

# または直接実行
ruff check app/
```

### 型チェック

```bash
# Makefile を使用
make type-check

# または直接実行
mypy app/
```

### すべてのチェックを実行

```bash
# Makefile を使用
make check

# またはスクリプトを使用
./scripts/lint.sh
```

## 設定ファイル

### pyproject.toml

すべてのツールの設定は `pyproject.toml` に集約されています：

- **Ruff**: 行の長さ、有効なルール、除外ディレクトリなど
- **Black**: 行の長さ、Pythonバージョンなど
- **Mypy**: 型チェックの厳密さ、プラグインなど

### 主な設定

- **行の長さ**: 100文字（Black と Ruff で統一）
- **Pythonバージョン**: 3.11
- **Ruffルール**: pycodestyle、pyflakes、isort、flake8-bugbear、pyupgrade

## エディタ統合

### VS Code / Kiro IDE

`.vscode/settings.json` が設定済みです：

- 保存時に自動フォーマット
- Ruff による自動リンティング
- Mypy による型チェック

推奨拡張機能：
- `ms-python.python`
- `ms-python.black-formatter`
- `charliermarsh.ruff`

## Pre-commit フック

Pre-commit を使用して、コミット前に自動チェックを実行できます：

```bash
# Pre-commit のインストール
pip install pre-commit

# フックのインストール
pre-commit install

# 手動実行
pre-commit run --all-files
```

## Docker での使用

```bash
# コンテナ内でフォーマット
docker exec -it ec-mock-backend bash -c "pip install -r requirements-dev.txt && make format"

# コンテナ内でチェック
docker exec -it ec-mock-backend bash -c "pip install -r requirements-dev.txt && make check"
```

## トラブルシューティング

### Ruff のエラー

```bash
# 自動修正可能な問題を修正
ruff check --fix app/

# 特定のルールを無視
# pyproject.toml の ignore セクションに追加
```

### Black のフォーマットエラー

```bash
# 変更をプレビュー
black --check --diff app/

# 実際にフォーマット
black app/
```

### Mypy の型エラー

```bash
# 詳細な出力
mypy --show-error-codes app/

# 特定のモジュールを無視
# pyproject.toml の [[tool.mypy.overrides]] セクションに追加
```

## ベストプラクティス

1. **コミット前に必ずフォーマット**: `make format`
2. **プルリクエスト前にチェック**: `make check`
3. **型ヒントを追加**: 関数の引数と戻り値に型を指定
4. **docstringを記述**: 複雑な関数にはドキュメントを追加

## CI/CD

GitHub Actions などで以下のコマンドを実行することを推奨：

```yaml
- name: Install dependencies
  run: |
    pip install -r requirements.txt
    pip install -r requirements-dev.txt

- name: Run linting
  run: make check
```
