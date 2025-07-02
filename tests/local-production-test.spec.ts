import { test, expect } from '@playwright/test'

test.describe('Local Production Test', () => {
  test('should verify local production build design', async ({ page }) => {
    // ローカルの本番ビルドにアクセス
    await page.goto('http://localhost:3001/dashboard')
    await page.waitForLoadState('networkidle')
    
    // スクリーンショットを撮影
    await page.screenshot({ 
      path: 'test-results/local-production-dashboard.png', 
      fullPage: true 
    })
    
    // スタイルが適用されているか確認
    const header = page.locator('header').first()
    const headerBg = await header.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    console.log('Header background color:', headerBg)
    
    // Tailwindクラスが機能しているか確認
    const bgGray = page.locator('.bg-gray-50').first()
    const grayBgColor = await bgGray.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    console.log('Gray background color:', grayBgColor)
  })
})