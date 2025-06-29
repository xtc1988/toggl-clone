# Google認証問題の簡単調査方法

## 1. ローカルテスト（最も確実）

```bash
cd /mnt/c/claudecode/CLAUDECODE/toggl-clone
npm run dev
```

- http://localhost:3000/login にアクセス
- 「Googleでログイン」をクリック
- ローカルならVercelの設定に関係なくテストできる

## 2. ブラウザでの調査

### A. コンソールエラーの確認
1. https://dainage2.vercel.app/login にアクセス
2. F12 → Console タブ
3. 「Googleでログイン」クリック
4. 表示されるエラーをコピー

### B. ネットワークエラーの確認
1. F12 → Network タブ
2. 「Googleでログイン」クリック
3. 失敗したリクエストを確認（赤色で表示）
4. レスポンスの詳細を確認

## 3. Supabase側の調査

### ダッシュボードでのログ確認
1. https://supabase.com/dashboard にログイン
2. プロジェクト選択
3. Authentication → Logs
4. ログイン試行時のログを確認

### プロバイダー設定の確認
1. Authentication → Providers
2. Google の設定を確認：
   - Enabled: ON
   - Client ID: 設定済み
   - Client Secret: 設定済み

## 4. Google Cloud Console側の調査

### OAuth設定の確認
1. https://console.cloud.google.com
2. 認証情報 → OAuth 2.0 クライアント ID
3. 承認済みのリダイレクトURIを確認：
   ```
   https://unaxmzlvejyjopeuciyz.supabase.co/auth/v1/callback
   ```

## 5. よくあるエラーと対処法

### "Invalid login credentials"
- **原因**: SupabaseでGoogle認証が無効
- **対処**: Authentication → Providers → Google を有効化

### "redirect_uri_mismatch"
- **原因**: Google Cloud ConsoleのリダイレクトURI設定が間違い
- **対処**: リダイレクトURIを正確に設定

### "Client ID not found"
- **原因**: SupabaseのClient ID設定が間違い
- **対処**: Google Cloud ConsoleからClient IDをコピーし直し

### ボタンを押しても何も起こらない
- **原因**: 環境変数が設定されていない
- **対処**: ブラウザのコンソールでエラーを確認

## 6. 手動でのOAuth URLテスト

ブラウザで直接以下URLにアクセス（Client IDを実際の値に置換）：

```
https://accounts.google.com/oauth/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=https://unaxmzlvejyjopeuciyz.supabase.co/auth/v1/callback&response_type=code&scope=openid%20email%20profile&state=test
```

## 7. 最終手段：設定リセット

1. Google Cloud ConsoleでOAuth クライアントIDを削除
2. 新しくOAuth クライアントIDを作成
3. SupabaseでClient IDとSecretを再設定
4. 設定が反映されるまで5-10分待つ

## 返金について

Claude Codeの返金申請：
- Anthropic公式サポート: https://support.anthropic.com
- メール: support@anthropic.com
- 利用規約の返金ポリシーを参照