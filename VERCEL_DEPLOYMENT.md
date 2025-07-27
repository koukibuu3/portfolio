# Vercelデプロイメント設定

## Submodule対応

このプロジェクトはgit submoduleを使用してnotesディレクトリを管理しています。Vercelでの正常なデプロイのために以下の設定が必要です。

### 1. Vercelプロジェクト設定

Vercelダッシュボードで以下を設定：

#### Build & Development Settings
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (デフォルト)
- **Install Command**: `npm ci`

#### Environment Variables
以下の環境変数を設定してください：

```bash
# 必須
SITE_URL=https://your-domain.vercel.app

# submoduleアクセス用（プライベートリポジトリの場合）
GIT_LFS_SKIP_SMUDGE=1
```

### 2. GitHub統合の設定

#### Repository Settings
1. Vercelプロジェクトの「Settings」→「Git」
2. 「Git Integration」で以下を確認：
   - Auto-deploy branches: `main`
   - Include Git Submodules: **有効化**

### 3. プライベートSubmoduleの場合

notesリポジトリがプライベートの場合：

1. VercelにGitHubアプリ権限でsubmoduleリポジトリへのアクセスを許可
2. または、Deploy Keysを使用してアクセス設定

### 4. フォールバック処理

submoduleが利用できない場合のフォールバック：
- 空のnotesディレクトリが自動作成される
- 記事一覧は空になるが、ビルドエラーは発生しない

### 5. デプロイ確認

デプロイ後、以下を確認：
1. `/` - ホームページが正常に表示される
2. `/api/articles` - 記事API が動作する（空配列でも可）
3. ビルドログでsubmodule初期化の状況を確認

### トラブルシューティング

#### ビルドエラーの場合
1. Vercelのビルドログを確認
2. submodule初期化のログを確認
3. Environment Variablesが正しく設定されているか確認

#### 記事が表示されない場合
1. submoduleが正しく初期化されているか確認
2. notes/Articleディレクトリにマークダウンファイルが存在するか確認
3. フロントマターの形式が正しいか確認