# Supabaseでのログ確認方法（最新版）

## 認証ログの確認場所

### 1. Authentication Logsの実際の場所

Supabaseの最新バージョンでは：

1. **Supabaseダッシュボード** → **Logs**（左サイドバー）
2. **Auth** または **Authentication** カテゴリを選択
3. リアルタイムでユーザーの認証試行が表示される

### 2. 別の確認方法

#### A. Auth Users画面
1. **Authentication** → **Users**
2. ユーザーが作成されているか確認
3. Google認証が成功していれば新しいユーザーが表示される

#### B. SQL Editor でのログ確認
1. **SQL Editor**
2. 以下のクエリを実行：
```sql
SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 10;
```

#### C. Database → Tables
1. **Database** → **Tables**
2. **auth** スキーマ → **users** テーブル
3. 新しいユーザーが作成されているか確認

### 3. エラーの確認方法

#### A. Real-time logs
1. **Logs** → **Realtime**
2. Google認証試行時のリアルタイムログ

#### B. API logs
1. **Logs** → **API**
2. 認証APIの呼び出しログ

### 4. 最も簡単な確認方法

#### ブラウザの開発者ツール
1. F12 → **Network** タブ
2. 「Googleでログイン」クリック
3. `signInWithOAuth` に関連するリクエストを確認
4. レスポンスのエラーメッセージを確認

#### コンソールログ
1. F12 → **Console** タブ
2. 以下のようなエラーがないか確認：
   - `Invalid login credentials`
   - `Client error`
   - `Provider not enabled`

### 5. 実際のエラー確認手順

#### Step 1: ブラウザコンソールを開く
```javascript
// ブラウザのコンソールで以下を実行
console.clear(); // ログをクリア
```

#### Step 2: ネットワークタブをクリア
- F12 → Network → Clear（ゴミ箱アイコン）

#### Step 3: Google認証を実行
- 「Googleでログイン」ボタンをクリック

#### Step 4: エラーを確認
- Consoleタブ: JavaScriptエラー
- Networkタブ: HTTPリクエストエラー

### 6. よくあるSupabaseエラーメッセージ

```
❌ "Provider google is not enabled"
→ Authentication → Providers → Google を有効化

❌ "Invalid client_id"
→ Google Cloud ConsoleのClient IDを確認

❌ "redirect_uri_mismatch"
→ Google Cloud ConsoleのリダイレクトURI設定を確認

❌ "Invalid request"
→ 環境変数の設定を確認
```

### 7. 確実な診断方法

#### A. ローカル環境でのテスト
```bash
npm run dev
```
- http://localhost:3000/login でテスト
- ローカルならVercelの設定に影響されない

#### B. Supabase設定の再確認
1. **Authentication** → **Providers** → **Google**
2. 以下が正しく設定されているか：
   - Enabled: ✅ ON
   - Client ID: [Google Cloud Consoleの値]
   - Client Secret: [Google Cloud Consoleの値]

#### C. Google Cloud Console設定の再確認
1. **認証情報** → **OAuth 2.0 クライアントID**
2. **承認済みのリダイレクトURI**:
   ```
   https://unaxmzlvejyjopeuciyz.supabase.co/auth/v1/callback
   ```