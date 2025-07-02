import { test, expect } from '@playwright/test'

test.describe('Production Dashboard Test', () => {
  test('should capture production dashboard', async ({ page }) => {
    // 本番環境のURLにアクセス
    await page.goto('https://toggl-clone-a4hcuan7r-sugitas-projects-d56a10e8.vercel.app/dashboard')
    await page.waitForLoadState('networkidle')
    
    // スクリーンショットを撮影
    await page.screenshot({ 
      path: 'test-results/production-dashboard.png', 
      fullPage: true 
    })
    
    // タイトルが存在することを確認
    await expect(page).toHaveTitle(/Toggle Clone/)
  })
})