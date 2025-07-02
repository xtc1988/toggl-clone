import { test, expect } from '@playwright/test'

test.describe('Final Dashboard Design Test', () => {
  test('should verify dashboard design and layout', async ({ page }) => {
    // エイリアスURLを使用
    await page.goto('https://toggl-clone-five.vercel.app/dashboard')
    await page.waitForLoadState('networkidle')
    
    // スクリーンショットを撮影
    await page.screenshot({ 
      path: 'test-results/final-dashboard.png', 
      fullPage: true 
    })
    
    // ヘッダーの存在を確認
    const header = page.locator('header').first()
    await expect(header).toBeVisible()
    
    // タイマーセクションの存在を確認  
    const timerSection = page.locator('.bg-gradient-to-r').first()
    await expect(timerSection).toBeVisible()
    
    // 統計カードの存在を確認
    const statsCards = page.locator('.grid').nth(1).locator('.bg-white')
    const cardCount = await statsCards.count()
    console.log('Statistics cards found:', cardCount)
    
    // ページタイトルを確認
    const title = await page.title()
    console.log('Page title:', title)
  })
})