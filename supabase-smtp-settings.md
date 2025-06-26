# Supabaseメール送信設定ガイド

## 問題
メール認証の確認メールが送信されない

## 原因
Supabaseの無料プランでは、デフォルトでメール送信が制限されています。

## 解決方法

### 方法1: Supabaseのテストメール機能を使用（開発環境向け）
1. Supabaseダッシュボード → Authentication → Users
2. 新規ユーザーを作成した後、「Send magic link」をクリック
3. テスト用のメールが送信される

### 方法2: SMTPサーバーを設定（本番環境向け）
1. Supabaseダッシュボード → Project Settings → Auth
2. SMTP Settingsセクションで「Enable Custom SMTP」をオン
3. 以下の情報を入力：
   - Host: SMTPサーバーのホスト名
   - Port: ポート番号（通常587または465）
   - Username: SMTPユーザー名
   - Password: SMTPパスワード
   - Sender email: 送信元メールアドレス
   - Sender name: 送信者名

### 推奨SMTPサービス（無料枠あり）
- SendGrid
- Mailgun
- Amazon SES
- Gmail（開発用、送信制限あり）

### 方法3: Supabaseの内蔵メール機能を使用（制限あり）
1. 無料プランでは1時間に3通まで
2. 有料プランにアップグレードすると制限が緩和

## 確認方法
1. Authentication → Logs でメール送信ログを確認
2. エラーがある場合は詳細を確認