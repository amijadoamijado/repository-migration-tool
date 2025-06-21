# Docker環境でのRepository Migration Tool実行ガイド

## Docker環境の利点

- 環境依存の問題を回避
- Node.js環境を準備する必要なし
- 安定した実行環境

## 実行手順

### 1. Dockerイメージのビルド

```bash
# イメージのビルド
docker build -t repo-migration-tool .

# または docker-composeを使用
docker-compose build
```

### 2. 環境変数の設定

`.env`ファイルを作成し、必要な環境変数を設定：

```
GITHUB_TOKEN=your_personal_access_token
SOURCE_OWNER=source_username
SOURCE_REPO=source_repository
TARGET_OWNER=target_username
TARGET_REPO=target_repository
```

### 3. コンテナの実行

```bash
# docker runで実行
docker run --env-file .env repo-migration-tool

# docker-composeで実行（推奨）
docker-compose up

# バックグラウンドで実行
docker-compose up -d
```

### 4. ログの確認

```bash
# ログの確認
docker-compose logs -f

# 特定のサービスのログ
docker-compose logs -f migration-tool
```

## トラブルシューティング

### よくある問題

1. **GitHub API認証エラー**
   - Personal Access Tokenが正しく設定されているか確認
   - トークンの権限（repo, workflow, delete_repo）を確認

2. **レート制限エラー**
   - GitHub APIの制限に達した場合は時間をおいて再実行
   - Personal Access Tokenを使用することでレート制限が緩和される

3. **ファイル移行エラー**
   - 対象リポジトリへの書き込み権限があるか確認
   - ファイルサイズ制限（100MB）を超えていないか確認

### デバッグ実行

```bash
# デバッグモードで実行
docker-compose -f docker-compose.debug.yml up

# コンテナ内でシェル実行
docker-compose exec migration-tool /bin/bash
```