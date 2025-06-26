# Google認証設定ガイド

## 1. Google Cloud Consoleでの設定

### OAuth 2.0クライアントIDの作成
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクトを作成または選択
3. 「APIとサービス」→「認証情報」へ移動
4. 「認証情報を作成」→「OAuth クライアント ID」を選択
5. アプリケーションの種類：「ウェブアプリケーション」を選択
6. 名前：任意の名前（例：Toggl Clone）
7. 承認済みのJavaScriptオリジン：
   - `https://dainage2.vercel.app`
   - `https://unaxmzlvejyjopeuciyz.supabase.co`
8. 承認済みのリダイレクトURI：
   - `https://unaxmzlvejyjopeuciyz.supabase.co/auth/v1/callback`
9. 「作成」をクリック
10. クライアントIDとクライアントシークレットをコピー

## 2. Supabaseでの設定

### Authentication設定
1. Supabaseダッシュボード → Authentication → Providers
2. Googleを有効化
3. 以下を入力：
   - Client ID: Google Cloud ConsoleでコピーしたクライアントID
   - Client Secret: Google Cloud Consoleでコピーしたクライアントシークレット
4. 「Save」をクリック

### URL Configuration
1. Authentication → URL Configuration
2. Site URL: `https://dainage2.vercel.app`
3. Redirect URLs:
   - `https://dainage2.vercel.app/**`
   - `https://dainage2.vercel.app/auth/callback`

## 3. 実装完了後の確認事項
- [ ] Google Cloud ConsoleでOAuth同意画面を設定
- [ ] SupabaseでGoogle認証が有効化されている
- [ ] リダイレクトURLが正しく設定されている
- [ ] 本番環境でテスト