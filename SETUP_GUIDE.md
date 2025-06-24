# Toggl Clone セットアップガイド（Vercel環境）

## 1. GitHubリポジトリの準備

### 1.1 リポジトリの作成
```bash
cd /mnt/c/claudecode/CLAUDECODE/toggl-clone
git init
git add .
git commit -m "Initial commit"
gh repo create toggl-clone --public --source=. --remote=origin --push
```

## 2. Supabaseプロジェクトの設定

### 2.1 Supabaseアカウント作成
1. [https://supabase.com](https://supabase.com) にアクセス
2. "Start your project" をクリック
3. GitHubアカウントでサインアップ

### 2.2 新規プロジェクト作成
1. "New project" をクリック
2. 以下を入力:
   - Project name: `toggl-clone`
   - Database Password: 強力なパスワードを設定（保存しておく）
   - Region: `Northeast Asia (Tokyo)`を選択
3. "Create new project" をクリック

### 2.3 プロジェクト情報の取得
プロジェクトが作成されたら、以下の情報を取得:

1. Settings → API から:
   - Project URL: `https://xxxxx.supabase.co`
   - anon public key: `eyJhbGciOiJS...`

### 2.4 データベーステーブルの作成
1. Supabaseダッシュボードで SQL Editor を開く
2. `supabase/schema.sql` の内容を全てコピー
3. SQL Editorに貼り付けて "Run" をクリック

成功すると以下のテーブルが作成されます:
- profiles
- projects
- time_entries
- client_logs

## 3. Vercelへのデプロイ

### 3.1 Vercelアカウント作成
1. [https://vercel.com](https://vercel.com) にアクセス
2. GitHubアカウントでログイン

### 3.2 プロジェクトのインポート
1. Vercelダッシュボードで "New Project" をクリック
2. GitHubリポジトリ（toggl-clone）をインポート
3. Framework Preset: "Next.js" が自動選択されることを確認

### 3.3 環境変数の設定
以下の環境変数を設定:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabaseから取得したProject URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseから取得したanon public key

**注意**: `NEXT_PUBLIC_SITE_URL` は設定不要（VercelのシステムURLを自動使用）

### 3.4 デプロイ
1. "Deploy" をクリック
2. デプロイが完了するまで待機（通常2-3分）
3. デプロイ完了後、提供されたURLをコピー（例: `https://toggl-clone-xxx.vercel.app`）

## 4. Supabase認証設定の更新

### 4.1 本番URLの設定
1. Supabaseダッシュボードに戻る
2. Authentication → URL Configuration を開く
3. 以下を設定:
   - Site URL: `https://toggl-clone-xxx.vercel.app`（VercelのURL）
   - Redirect URLs に追加:
     - `https://toggl-clone-xxx.vercel.app/auth/callback`
     - `https://toggl-clone-xxx.vercel.app/**`（ワイルドカード）

### 4.2 Email Templates（必要に応じて）
1. Authentication → Email Templates
2. 各テンプレートのリンクURLをVercelのURLに更新

## 5. 動作確認

### 5.1 アプリケーションの確認
1. VercelのURLにアクセス
2. サインアップページが表示されることを確認

### 5.2 認証フローのテスト
1. テスト用メールアドレスでサインアップ
2. 確認メールを受信
3. メール内のリンクをクリック
4. ログインできることを確認

## 6. カスタムドメイン設定（オプション）

### 6.1 Vercelでドメイン設定
1. Vercel プロジェクト → Settings → Domains
2. カスタムドメインを追加
3. DNSレコードを設定

### 6.2 Supabase設定の更新
カスタムドメイン設定後、Supabaseの認証URLも更新:
1. Site URL をカスタムドメインに変更
2. Redirect URLs にカスタムドメインを追加

## 7. トラブルシューティング

### よくある問題

#### 認証エラー
- エラー: "Invalid login credentials"
  → メールアドレスの確認が完了しているか確認
  → Supabaseの認証URLがVercelのURLと一致しているか確認

#### CORS エラー
- Supabaseの設定でVercelドメインが許可されているか確認
- 環境変数が正しく設定されているか確認

#### データベース接続エラー
- 環境変数が正しく設定されているか確認
- Supabaseプロジェクトが稼働中か確認

### デバッグ方法
1. Vercel → Functions → Logsでサーバーサイドログを確認
2. ブラウザの開発者ツールでクライアントサイドエラーを確認
3. Supabaseダッシュボードでデータベースログを確認

## 8. 本番環境の管理

### 8.1 環境変数の更新
Vercel → Settings → Environment Variables から更新可能

### 8.2 再デプロイ
```bash
git add .
git commit -m "Update: 変更内容"
git push origin main
```
→ 自動的に再デプロイされる

### 8.3 プレビューデプロイ
Pull Requestを作成すると、自動的にプレビュー環境が作成される

## 9. 次のステップ

基本的なセットアップが完了したら、以下の機能を実装:

1. タイマー機能の実装
2. プロジェクト管理機能
3. レポート機能
4. リアルタイム同期

詳細は `SPECIFICATION.md` を参照してください。