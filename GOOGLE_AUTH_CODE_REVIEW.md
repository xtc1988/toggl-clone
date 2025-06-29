# Google認証コードレビュー文書

このドキュメントは、toggl-cloneプロジェクトのGoogle認証実装を1行ずつ検証し、各行が正しい理由を説明します。

## 1. ログインページ実装の検証（app/(auth)/login/page.tsx）

### インポート部分（1-6行目）
```typescript
'use client'                                        // ✅ 正しい: クライアントコンポーネントとして必要
import { useState, useEffect } from 'react'         // ✅ 正しい: 状態管理とライフサイクル管理に必要
import Link from 'next/link'                       // ✅ 正しい: Next.jsのルーティングに必要
import { useRouter } from 'next/navigation'        // ✅ 正しい: Next.js 13+のApp Routerナビゲーション
import { createClient } from '@/utils/supabase/client' // ✅ 正しい: Supabaseクライアントの作成
```

### Google認証ボタン実装（82-166行目）
```typescript
<button
  type="button"
  onClick={async () => {
    const timestamp = new Date().toISOString()      // ✅ 正しい: デバッグ用タイムスタンプ
    const debugMsg = `[${timestamp}] Googleログインボタンクリック`
    setDebugInfo(prev => [...prev, debugMsg])       // ✅ 正しい: デバッグ情報の追加
    
    console.log('Googleログインボタンクリック')        // ✅ 正しい: コンソールログ
    console.log('Current origin:', window.location.origin) // ✅ 正しい: 現在のオリジン確認
    console.log('Redirect URL:', `${window.location.origin}/auth/callback`) // ✅ 正しい: リダイレクトURL確認
    
    // APIにログを送信
    try {
      await fetch('/api/auth-logs', {               // ✅ 正しい: ログAPI呼び出し
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'google_login_clicked',
          origin: window.location.origin,
          redirectUrl: `${window.location.origin}/auth/callback`,
          timestamp: new Date().toISOString()
        })
      })
    } catch (e) {
      console.error('Failed to send log:', e)      // ✅ 正しい: エラーハンドリング
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',                           // ✅ 正しい: プロバイダー指定
      options: {
        redirectTo: `${window.location.origin}/auth/callback` // ✅ 正しい: 動的リダイレクトURL
      }
    })
```

### 問題点の可能性
1. **リダイレクトURL**: `window.location.origin`を使用しているが、本番環境では`https://dainage2.vercel.app`になるべき

## 2. 認証コールバック実装の検証（app/auth/callback/route.ts）

### コールバックハンドラー（23-140行目）
```typescript
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)           // ✅ 正しい: URLパース
  const code = requestUrl.searchParams.get('code')  // ✅ 正しい: 認証コード取得
  const error = requestUrl.searchParams.get('error') // ✅ 正しい: エラー取得
  
  // デバッグ用出力
  console.log('=== Auth Callback Debug ===')       // ✅ 正しい: デバッグ情報
  console.log('URL:', request.url)
  console.log('Code:', code ? 'received' : 'missing')
  
  if (code) {
    try {
      const supabase = await createClient()         // ✅ 正しい: Supabaseクライアント作成
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code) // ✅ 正しい: コード交換
      
      if (exchangeError) {
        // エラーハンドリング                          // ✅ 正しい: エラー処理
        const errorUrl = new URL('/login', request.url)
        errorUrl.searchParams.set('error', 'exchange_failed')
        return NextResponse.redirect(errorUrl)
      }
      
      return NextResponse.redirect(new URL('/dashboard', request.url)) // ✅ 正しい: 成功時リダイレクト
    } catch (error) {
      // 例外処理                                     // ✅ 正しい: 例外ハンドリング
    }
  }
}
```

## 3. ミドルウェア実装の検証（utils/supabase/middleware.ts）

### 認証チェック部分（11-25行目）
```typescript
// Public paths that don't require authentication
const publicPaths = ['/login', '/signup', '/test-env', '/auth-debug', 
                    '/debug-auth', '/test-auth', '/test-button', 
                    '/view-logs', '/auth-status', '/view-auth-logs', 
                    '/env-check', '/google-auth-test']  // ⚠️ 問題: google-auth-testが追加されているがリダイレクトされる

const isPublicPath = publicPaths.some(path => 
  request.nextUrl.pathname.startsWith(path)         // ✅ 正しい: パスマッチング
)

// Override: If accessing google-auth-test, always allow
if (request.nextUrl.pathname === '/google-auth-test') {
  console.log('OVERRIDE: Allowing access to /google-auth-test')
  return response                                   // ✅ 正しい: オーバーライド処理
}
```

### 問題点
1. **環境変数の読み込み順序**: 環境変数が読み込まれる前にパブリックパスのチェックが行われている可能性

## 4. 環境変数の検証（.env.local）

```bash
NEXT_PUBLIC_SUPABASE_URL='https://unaxmzlvejyjopeuciyz.supabase.co'  # ✅ 正しい: Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY='eyJhbGciOiJI...'    # ✅ 正しい: 公開APIキー
NEXT_PUBLIC_SITE_URL='https://dainage2.vercel.app' # ✅ 正しい: サイトURL
```

## 5. Google認証設定の検証（google-auth-setup.md）

### Google Cloud Console設定
```
承認済みのJavaScriptオリジン：
- https://dainage2.vercel.app                       # ✅ 正しい: アプリケーションURL
- https://unaxmzlvejyjopeuciyz.supabase.co        # ✅ 正しい: Supabase URL

承認済みのリダイレクトURI：
- https://unaxmzlvejyjopeuciyz.supabase.co/auth/v1/callback # ✅ 正しい: Supabaseコールバック
```

## 発見された問題点

### 1. ミドルウェアの問題
- **問題**: publicPathsに追加したパスが機能していない
- **原因**: Vercel上でミドルウェアがキャッシュされている可能性
- **解決策**: ミドルウェアの完全な書き換えまたは別のアプローチ

### 2. 環境変数の問題
- **問題**: 本番環境で環境変数が正しく読み込まれていない可能性
- **原因**: Vercelの環境変数設定
- **解決策**: Vercelダッシュボードで環境変数を確認

### 3. リダイレクトURLの問題
- **問題**: 動的URLではなく固定URLを使用すべき
- **原因**: window.location.originの使用
- **解決策**: 環境変数から読み込む

## 推奨される修正

1. **ミドルウェアの修正**: publicPathsの処理を改善
2. **環境変数の統一**: NEXT_PUBLIC_SITE_URLを一貫して使用
3. **エラーログの改善**: より詳細なエラー情報を記録
4. **テストページのアクセス方法変更**: APIエンドポイントとして実装

## 追加の調査結果

### Vercelプロジェクトの問題
1. **Project Protection有効**: VercelプロジェクトでSSO認証が要求されている
   - すべてのリクエストがVercelのSSO認証ページにリダイレクトされる
   - これが根本的な原因でGoogle認証のテストができない

### Google認証フローの詳細分析

#### 1. ログインページのGoogle認証ボタン
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`  // 動的URL
  }
})
```
**問題**: `window.location.origin`は本番では`https://dainage2.vercel.app`になるが、Supabaseの設定と一致しているか不明

#### 2. Supabaseクライアント作成
```typescript
// client.ts
return createBrowserClient(
  supabaseUrl || 'https://placeholder.supabase.co',  // フォールバック
  supabaseKey || 'placeholder-key'
)
```
**問題**: 環境変数が未設定の場合、プレースホルダーが使われるため、エラーが隠蔽される

#### 3. コールバック処理
```typescript
const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
```
**正しい**: 標準的なOAuth認証コードフロー

## 最終診断

### 根本原因
1. **Vercel Project Protection**: プロジェクト全体がSSO保護されている
2. **環境変数の確認不可**: SSO保護により環境変数の状態を確認できない
3. **Google OAuth設定の確認不可**: Supabase側の設定も確認できない

### 解決手順
1. **最優先**: Vercelダッシュボードで Project Protection を無効化
2. **環境変数確認**: Vercelダッシュボードで以下を確認
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXT_PUBLIC_SITE_URL
3. **Supabase設定確認**:
   - Authentication → Providers → Google が有効化されているか
   - Client IDとClient Secretが設定されているか
   - Site URLが正しく設定されているか
4. **Google Cloud Console確認**:
   - OAuth 2.0クライアントIDの承認済みURL設定