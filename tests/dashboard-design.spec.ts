import { test, expect } from '@playwright/test'

test.describe('Dashboard Design Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
  })

  test('should capture dashboard screenshots at different viewports', async ({ page }) => {
    // デスクトップビュー
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.screenshot({ 
      path: 'test-results/dashboard-desktop.png', 
      fullPage: true 
    })

    // タブレットビュー
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.screenshot({ 
      path: 'test-results/dashboard-tablet.png', 
      fullPage: true 
    })

    // モバイルビュー
    await page.setViewportSize({ width: 375, height: 667 })
    await page.screenshot({ 
      path: 'test-results/dashboard-mobile.png', 
      fullPage: true 
    })
  })

  test('should verify header design', async ({ page }) => {
    const header = page.locator('header')
    
    // ヘッダーの高さが64pxであることを確認
    const headerBox = await header.boundingBox()
    expect(headerBox?.height).toBe(64)
    
    // ヘッダーの背景色を確認
    const headerBgColor = await header.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    expect(headerBgColor).toBe('rgb(255, 255, 255)')
    
    // ロゴが表示されていることを確認
    await expect(page.locator('text=Toggle Clone')).toBeVisible()
  })

  test('should verify timer section design', async ({ page }) => {
    const timerSection = page.locator('.bg-gradient-to-r').first()
    
    // タイマーセクションが表示されていることを確認
    await expect(timerSection).toBeVisible()
    
    // グラデーション背景が適用されていることを確認
    const bgImage = await timerSection.evaluate(el => 
      window.getComputedStyle(el).backgroundImage
    )
    expect(bgImage).toContain('gradient')
    
    // タイマーボタンが表示されていることを確認
    const playButton = page.locator('button').filter({ has: page.locator('svg') }).last()
    await expect(playButton).toBeVisible()
  })

  test('should verify statistics cards layout', async ({ page }) => {
    // 統計カードのグリッドレイアウトを確認
    const statsGrid = page.locator('.grid').nth(1)
    
    // デスクトップでは4カラムレイアウト
    await page.setViewportSize({ width: 1440, height: 900 })
    const desktopGridCols = await statsGrid.evaluate(el => 
      window.getComputedStyle(el).gridTemplateColumns
    )
    expect(desktopGridCols).toContain('repeat(4')
    
    // 統計カードが4つ表示されていることを確認
    const cards = statsGrid.locator('.bg-white.rounded-xl')
    await expect(cards).toHaveCount(4)
    
    // 各カードのアイコンが表示されていることを確認
    for (let i = 0; i < 4; i++) {
      const card = cards.nth(i)
      await expect(card.locator('svg')).toBeVisible()
    }
  })

  test('should verify charts section', async ({ page }) => {
    // チャートセクションの存在を確認
    const chartsSection = page.locator('.grid').nth(2)
    await expect(chartsSection).toBeVisible()
    
    // 週次チャートのタイトルを確認
    await expect(page.locator('text=Time Tracking This Week')).toBeVisible()
    
    // プロジェクト別チャートのタイトルを確認
    await expect(page.locator('text=Time by Projects')).toBeVisible()
  })

  test('should verify recent activities table', async ({ page }) => {
    // アクティビティテーブルの存在を確認
    await expect(page.locator('text=Recent Activities')).toBeVisible()
    
    // テーブルヘッダーを確認
    await expect(page.locator('th:has-text("Project")')).toBeVisible()
    await expect(page.locator('th:has-text("Task")')).toBeVisible()
    await expect(page.locator('th:has-text("Duration")')).toBeVisible()
  })

  test('should verify responsive design', async ({ page }) => {
    // モバイルビューでの統計カードレイアウトを確認
    await page.setViewportSize({ width: 375, height: 667 })
    const mobileStatsGrid = page.locator('.grid').nth(1)
    const mobileGridCols = await mobileStatsGrid.evaluate(el => 
      window.getComputedStyle(el).gridTemplateColumns
    )
    
    // モバイルでは1カラムレイアウトになることを確認
    expect(mobileGridCols).not.toContain('repeat(4')
  })

  test('should check Tailwind CSS is loaded', async ({ page }) => {
    // Tailwind CSSのユーティリティクラスが機能していることを確認
    const element = page.locator('.bg-gray-50').first()
    const bgColor = await element.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    // Tailwind CSSが読み込まれていない場合、背景色が適用されない
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)') // transparent
  })
})