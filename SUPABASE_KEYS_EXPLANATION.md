# Supabase APIキーの詳細説明

## Supabaseの2つのキー

### 1. **anon key（公開可能キー）** ← これを使用！
- **正式名称**: `anon` (anonymous) key
- **用途**: クライアントサイド（ブラウザ）で使用
- **特徴**: 
  - 公開しても安全
  - Row Level Security (RLS) で保護される
  - GitHubにコミットしてもOK
  - 環境変数名: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. **service_role key（秘密キー）** ← 使用禁止！
- **正式名称**: `service_role` key
- **用途**: サーバーサイドの管理者権限が必要な処理
- **特徴**:
  - 絶対に公開してはいけない
  - RLSをバイパスする
  - GitHubにコミット禁止
  - クライアントサイドで使用禁止

## どのキーを使うか

### Next.js（toggl-clone）の場合
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://unaxmzlvejyjopeuciyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # ← anon keyを使用
```

**重要**: `NEXT_PUBLIC_`プレフィックスがついた環境変数はブラウザに公開されるため、必ず**anon key**を使用

## Supabaseダッシュボードでキーを確認する方法

1. Supabaseダッシュボードにログイン
2. 左サイドバーの「Settings」をクリック
3. 「API」セクションを選択
4. 以下が表示される：

```
Project URL
https://unaxmzlvejyjopeuciyz.supabase.co

Project API keys

anon public                                    ← これを使用！
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...       
[Reveal] [Copy]

service_role secret                            ← 使用しない！
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
[Reveal] [Copy]
```

## 実際の設定例

### Vercel環境変数設定
1. Vercelダッシュボード → Settings → Environment Variables
2. 以下を追加：

```
変数名: NEXT_PUBLIC_SUPABASE_ANON_KEY
値: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuYXhtemx2ZWp5am9wZXVjaXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NTMyNDQsImV4cCI6MjA2NjMyOTI0NH0.4Jqp_Px9kwcOzTApdw0wi4PLdTY1d0fNLhMcgj73oh0
```

### なぜanon keyを使うのか

1. **セキュリティ**: anon keyはRLSで保護されているため、公開しても安全
2. **Google認証**: OAuth認証はクライアントサイドで開始されるため、anon keyが必要
3. **Next.js規約**: `NEXT_PUBLIC_`プレフィックスの環境変数はクライアントに公開される

## よくある間違い

### ❌ 間違い: service_role keyを使用
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI... # service_roleキーを入れてしまう
```

### ✅ 正解: anon keyを使用
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI... # anon keyを入れる
```

## 確認方法

キーが正しいかを確認するには、JWTをデコードして`role`を確認：

1. https://jwt.io/ にアクセス
2. キーをペースト
3. Payloadセクションで`"role": "anon"`となっていればOK
4. `"role": "service_role"`となっていたら間違い！