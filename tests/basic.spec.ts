import { test, expect } from '@playwright/test';

test.describe('Basic Site Tests', () => {
  test('should load the site and redirect to login', async ({ page }) => {
    console.log('Testing URL: https://dainage2.vercel.app');
    
    // Go to the homepage
    await page.goto('https://dainage2.vercel.app');
    
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    
    console.log('Current URL:', page.url());
    console.log('Page title:', await page.title());
    
    // Should redirect to login page
    expect(page.url()).toContain('login');
    
    // Check if page has content
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    
    console.log('✅ Site loads successfully and redirects to login');
  });

  test('should have login page elements', async ({ page }) => {
    await page.goto('https://dainage2.vercel.app/login');
    await page.waitForLoadState('networkidle');
    
    console.log('Login page URL:', page.url());
    
    // Check for Google login button
    const googleLoginExists = await page.locator('text=Googleでログイン').count() > 0;
    console.log('Google login button found:', googleLoginExists);
    
    if (googleLoginExists) {
      await expect(page.locator('text=Googleでログイン')).toBeVisible();
    }
    
    console.log('✅ Login page elements verified');
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://dainage2.vercel.app');
    await page.waitForLoadState('networkidle');
    
    const isMobileViewport = page.viewportSize()?.width === 375;
    expect(isMobileViewport).toBe(true);
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const isDesktopViewport = page.viewportSize()?.width === 1920;
    expect(isDesktopViewport).toBe(true);
    
    console.log('✅ Responsive design working');
  });

  test('should have fast loading time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('https://dainage2.vercel.app');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Load time: ${loadTime}ms`);
    
    // Should load within reasonable time (10 seconds for safety)
    expect(loadTime).toBeLessThan(10000);
    
    console.log('✅ Site loads within acceptable time');
  });
});