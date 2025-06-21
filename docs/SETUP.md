# Repository Migration Tool セットアップガイド

## 概要

このツールは、GitHubリポジトリ間でのファイル移行を自動化するためのツールです。

## 前提条件

- Node.js 18以上
- Docker Desktop（Docker環境での実行の場合）
- GitHub Personal Access Token

## セットアップ手順

### 1. 環境構築

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してGitHub Personal Access Tokenを設定
```

### 2. GitHub Personal Access Token の取得

1. GitHub Settings > Developer settings > Personal access tokens
2. 「Generate new token (classic)」をクリック
3. 以下のスコープを選択：
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
   - `delete_repo` (Delete repositories)

### 3. 環境変数設定

`.env`ファイルに以下を設定：

```
GITHUB_TOKEN=your_personal_access_token_here
SOURCE_OWNER=source_github_username
SOURCE_REPO=source_repository_name
TARGET_OWNER=target_github_username
TARGET_REPO=target_repository_name
```

### 4. 実行

```bash
# 開発環境での実行
npm run dev

# 本番環境での実行
npm start

# Docker環境での実行
docker-compose up
```

## 注意事項

- 大量のファイル移行時はGitHub APIレート制限に注意
- Personal Access Tokenは適切に管理し、外部に漏洩しないよう注意
- 移行前に必ずバックアップを取得することを推奨