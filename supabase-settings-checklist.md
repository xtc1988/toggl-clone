# Supabase設定チェックリスト

## 1. Google Cloud Console側の設定

### OAuth 2.0 クライアント設定
- [ ] **承認済みのJavaScriptオリジン**に以下が含まれているか：
  - `https://dainage2.vercel.app`
  - `https://unaxmzlvejyjopeuciyz.supabase.co`
  
- [ ] **承認済みのリダイレクトURI**に以下が含まれているか：
  - `https://unaxmzlvejyjopeuciyz.supabase.co/auth/v1/callback`

## 2. Supabaseダッシュボード側の設定

### Authentication → Providers → Google
- [ ] Google認証が**有効化（Enabled）**されているか
- [ ] **Client ID**が正しく入力されているか
- [ ] **Client Secret**が正しく入力されているか
- [ ] **Authorized Client IDs**は空欄でOK（通常不要）

### Authentication → URL Configuration
- [ ] **Site URL**が以下に設定されているか：
  - `https://dainage2.vercel.app`
  
- [ ] **Redirect URLs**に以下が含まれているか：
  - `https://dainage2.vercel.app/**`
  - `https://dainage2.vercel.app/auth/callback`

### Authentication → Email Templates（確認）
- [ ] **Confirm signup**のテンプレートURL：
  - `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup`

## 3. よくある問題と解決方法

### エラー: "Error 400: redirect_uri_mismatch"
→ Google Cloud ConsoleのリダイレクトURIが正しくない

### エラー: "Invalid request"
→ Client IDまたはClient Secretが正しくない

### エラー: "Callback URL mismatch"
→ SupabaseのRedirect URLsの設定が正しくない

### ログイン後、ダッシュボードに遷移しない
→ `/auth/callback`の実装に問題がある可能性

## 4. デバッグ方法

1. ブラウザの開発者ツールでネットワークタブを確認
2. Supabase Dashboard → Authentication → Logs でエラーログを確認
3. `/test-auth`ページで詳細なエラー情報を取得