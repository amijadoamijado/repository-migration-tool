FROM node:18-alpine

WORKDIR /app

# 依存関係ファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci --only=production

# アプリケーションコードをコピー
COPY . .

# TypeScriptをビルド
RUN npm run build

# アプリケーションを実行
CMD ["npm", "start"]