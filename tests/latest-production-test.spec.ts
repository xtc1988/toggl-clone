import { test, expect } from '@playwright/test'

test.describe('Latest Production Dashboard Test', () => {
  test('should capture latest production dashboard', async ({ page }) => {
    // 最新の本番環境URLにアクセス
    await page.goto('https://toggl-clone-3olcmcomn-sugitas-projects-d56a10e8.vercel.app/')
    await page.waitForLoadState('networkidle')
    
    // ダッシュボードページに遷移されるはず
    await page.waitForURL('**/dashboard', { timeout: 10000 })
    
    // スクリーンショットを撮影
    await page.screenshot({ 
      path: 'test-results/latest-production-dashboard.png', 
      fullPage: true 
    })
    
    // ページ内容の確認
    const pageContent = await page.locator('body').textContent()
    console.log('Page content preview:', pageContent?.substring(0, 200))
  })
})