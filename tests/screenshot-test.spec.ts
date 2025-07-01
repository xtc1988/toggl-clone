import { test, expect } from '@playwright/test';

const BASE_URL = 'https://dainage2.vercel.app';

test.describe('Screenshot Tests', () => {
  test('should capture login page screenshot', async ({ page }) => {
    console.log('📸 Capturing login page screenshot...');
    
    // ログインページに移動
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // ページタイトルを確認
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // ページの基本要素を確認
    await expect(page.locator('text=Googleでログイン')).toBeVisible();
    await expect(page.locator('text=アカウントにログイン')).toBeVisible();
    
    // フルページスクリーンショット
    await page.screenshot({ 
      path: 'test-results/login-page-full.png', 
      fullPage: true 
    });
    console.log('✅ Full page screenshot saved: test-results/login-page-full.png');
    
    // ビューポートスクリーンショット
    await page.screenshot({ 
      path: 'test-results/login-page-viewport.png' 
    });
    console.log('✅ Viewport screenshot saved: test-results/login-page-viewport.png');
    
    // 特定要素のスクリーンショット
    const loginForm = page.locator('form').first();
    await loginForm.screenshot({ 
      path: 'test-results/login-form-element.png' 
    });
    console.log('✅ Login form screenshot saved: test-results/login-form-element.png');
  });

  test('should capture mobile responsive screenshots', async ({ page }) => {
    console.log('📱 Capturing mobile responsive screenshots...');
    
    // モバイルビューポートに設定
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // モバイル版スクリーンショット
    await page.screenshot({ 
      path: 'test-results/login-page-mobile.png',
      fullPage: true 
    });
    console.log('✅ Mobile screenshot saved: test-results/login-page-mobile.png');
    
    // デスクトップビューポートに変更
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // デスクトップ版スクリーンショット
    await page.screenshot({ 
      path: 'test-results/login-page-desktop.png',
      fullPage: true 
    });
    console.log('✅ Desktop screenshot saved: test-results/login-page-desktop.png');
  });

  test('should capture element states and interactions', async ({ page }) => {
    console.log('🎯 Capturing element states...');
    
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // 初期状態
    await page.screenshot({ 
      path: 'test-results/login-initial-state.png'
    });
    console.log('✅ Initial state screenshot saved');
    
    // Google loginボタンにホバー
    const googleButton = page.locator('text=Googleでログイン');
    await googleButton.hover();
    await page.screenshot({ 
      path: 'test-results/login-google-button-hover.png'
    });
    console.log('✅ Google button hover screenshot saved');
    
    // フォームに入力
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    await page.screenshot({ 
      path: 'test-results/login-form-filled.png'
    });
    console.log('✅ Form filled screenshot saved');
    
    // バージョン情報部分のスクリーンショット
    const versionInfo = page.locator('.text-xs.text-gray-400');
    if (await versionInfo.count() > 0) {
      await versionInfo.screenshot({ 
        path: 'test-results/version-info.png'
      });
      console.log('✅ Version info screenshot saved');
      
      // バージョン情報のテキストを取得
      const versionText = await versionInfo.textContent();
      console.log(`Version info text: ${versionText}`);
    }
  });

  test('should test error states', async ({ page }) => {
    console.log('❌ Testing error states...');
    
    // 404ページのスクリーンショット
    await page.goto(`${BASE_URL}/nonexistent-page`);
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'test-results/404-error-page.png',
      fullPage: true 
    });
    console.log('✅ 404 error page screenshot saved');
    
    // レスポンスステータスを確認
    const response = await page.goto(`${BASE_URL}/nonexistent-page`);
    console.log(`404 page status: ${response?.status()}`);
  });
});