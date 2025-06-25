# Supabase認証設定ガイド

## 設定が必要な項目

### 1. SupabaseダッシュボードでAuthentication設定を開く
- プロジェクトのダッシュボード → Authentication → URL Configuration

### 2. Site URLを更新
```
https://dainage2.vercel.app
```

### 3. Redirect URLsに以下を追加
```
https://dainage2.vercel.app/**
https://dainage2.vercel.app/auth/callback
```

### 4. Email Templates設定（必要な場合）
- Email Templates → Confirm signup
- Confirmation URLを以下に変更：
```
{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup
```

### 5. 設定保存
- 「Save」ボタンをクリックして設定を保存

## 確認事項
- [ ] Site URLが正しく設定されているか
- [ ] Redirect URLsが追加されているか
- [ ] Email templatesのURLが正しいか

## トラブルシューティング
- ログインできない場合：Redirect URLsの設定を再確認
- メール認証が機能しない場合：Email Templates設定を確認
- 403エラーが出る場合：環境変数とSupabase URLが一致しているか確認

## 重要：Vercelプロジェクトの公開設定
現在、プロジェクトがSSO認証を要求しています。アプリケーションを公開するには：

1. Vercelダッシュボード → プロジェクト設定
2. Settings → General → Project Protection
3. "Vercel Authentication"を無効化
4. "Password Protection"も無効化

または、Vercel CLIで：
```bash
# 現在この機能はCLIでは利用できません
# Vercelダッシュボードから設定してください
```