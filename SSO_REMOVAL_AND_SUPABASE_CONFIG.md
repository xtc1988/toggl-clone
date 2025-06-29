# SSO保護の解除方法とSupabase設定ガイド

## 1. Vercel SSO保護の解除手順

### Step 1: Vercelダッシュボードにログイン
1. https://vercel.com にアクセス
2. あなたのアカウントでログイン

### Step 2: プロジェクト設定を開く
1. `toggl-clone`プロジェクトを選択
2. 上部メニューの「Settings」タブをクリック

### Step 3: Project Protectionを無効化
1. 左側メニューから「General」を選択
2. 下にスクロールして「Project Protection」セクションを探す
3. 以下の設定を変更：
   - **Vercel Authentication**: `Disabled`（無効）に変更
   - **Password Protection**: `Disabled`（無効）に変更
4. 「Save」ボタンをクリック

### 注意事項
- 変更後、反映まで数分かかる場合があります
- キャッシュをクリアするため、ブラウザのシークレットモードでテストすることを推奨

## 2. Supabaseの設定期待値

### A. Authentication → Providers → Google設定

#### 必須設定項目
```
Provider: Google
Enabled: ON（有効）

Client ID (for OAuth): 
[Google Cloud ConsoleからコピーしたクライアントID]
例: 123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com

Client Secret (for OAuth):
[Google Cloud Consoleからコピーしたクライアントシークレット]
例: GOCSPX-1234567890abcdefghijklmn
```

#### 確認方法
1. Supabaseダッシュボード → Authentication → Providers
2. Googleの行を見つけて「Enabled」がONになっているか確認
3. Client IDとClient Secretが入力されているか確認

### B. Authentication → URL Configuration

#### Site URL（必須）
```
https://dainage2.vercel.app
```
- トップレベルのURLのみ（パスは含めない）
- httpsで始まること
- 末尾にスラッシュを含めない

#### Redirect URLs（必須）
```
https://dainage2.vercel.app/**
```
- ワイルドカードを使用して全パスを許可
- または個別に以下を追加：
  - `https://dainage2.vercel.app/auth/callback`
  - `https://dainage2.vercel.app/login`
  - `https://dainage2.vercel.app/dashboard`

### C. Google Cloud Console側の設定期待値

#### OAuth 2.0 クライアントID設定

##### 承認済みのJavaScriptオリジン
```
https://dainage2.vercel.app
https://unaxmzlvejyjopeuciyz.supabase.co
```

##### 承認済みのリダイレクトURI
```
https://unaxmzlvejyjopeuciyz.supabase.co/auth/v1/callback
```
- 必ずSupabaseプロジェクトURLを使用
- `/auth/v1/callback`パスは固定

### D. 環境変数の期待値（Vercel）

#### 必須環境変数
```bash
NEXT_PUBLIC_SUPABASE_URL=https://unaxmzlvejyjopeuciyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（実際のキー）
NEXT_PUBLIC_SITE_URL=https://dainage2.vercel.app
```

#### 設定方法
1. Vercelダッシュボード → Settings → Environment Variables
2. 各環境変数を追加（Production、Preview、Development全てにチェック）
3. 「Save」をクリック
4. デプロイメントを再実行（Redeploy）

## 3. 設定チェックリスト

### Vercel側
- [ ] Project ProtectionのVercel Authenticationが無効
- [ ] Project ProtectionのPassword Protectionが無効
- [ ] 環境変数NEXT_PUBLIC_SUPABASE_URLが設定済み
- [ ] 環境変数NEXT_PUBLIC_SUPABASE_ANON_KEYが設定済み
- [ ] 環境変数NEXT_PUBLIC_SITE_URLが設定済み

### Supabase側
- [ ] Google認証プロバイダーが有効
- [ ] Client IDが設定済み
- [ ] Client Secretが設定済み
- [ ] Site URLが`https://dainage2.vercel.app`
- [ ] Redirect URLsに`https://dainage2.vercel.app/**`が追加済み

### Google Cloud Console側
- [ ] OAuth 2.0クライアントIDが作成済み
- [ ] 承認済みJavaScriptオリジンに両方のURLが追加済み
- [ ] 承認済みリダイレクトURIにSupabaseコールバックURLが追加済み
- [ ] OAuth同意画面が設定済み（テストユーザーが追加されている）

## 4. トラブルシューティング

### エラー: "Invalid login credentials"
- Supabaseで Google プロバイダーが無効になっている
- Client IDまたはClient Secretが間違っている

### エラー: "redirect_uri_mismatch"
- Google Cloud ConsoleのリダイレクトURIが正しく設定されていない
- Supabase URLが間違っている

### エラー: "Callback URL mismatch"
- SupabaseのRedirect URLsが正しく設定されていない
- Site URLが間違っている

### ログインボタンを押しても何も起こらない
- 環境変数が設定されていない
- ブラウザのポップアップブロッカーが有効

## 5. 設定完了後のテスト手順

1. ブラウザのキャッシュをクリア（またはシークレットモードを使用）
2. https://dainage2.vercel.app/login にアクセス
3. 「Googleでログイン」ボタンをクリック
4. Googleアカウントを選択
5. 権限を許可
6. ダッシュボードにリダイレクトされることを確認

## 6. デバッグ用URL

設定後、以下のURLで動作確認：
- https://dainage2.vercel.app/api/debug-google-auth （JSON形式の診断結果）
- https://dainage2.vercel.app/google-auth-test （ビジュアル診断ページ）
- https://dainage2.vercel.app/view-auth-logs （認証ログ表示）