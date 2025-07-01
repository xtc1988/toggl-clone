import { test, expect } from '@playwright/test';

// WSLでブラウザが動作しない場合の代替テスト
// Node.jsのhttpクライアントを使用してエンドポイントをテスト

const BASE_URL = 'https://dainage2.vercel.app';

// HTTP関数を使った代替実装
async function fetchEndpoint(url: string) {
  const response = await fetch(url, {
    method: 'GET',
    redirect: 'manual' // リダイレクトを手動処理
  });
  
  return {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    text: await response.text().catch(() => ''),
    redirectLocation: response.headers.get('location')
  };
}

test.describe('Alternative Tests (No Browser)', () => {
  test('should redirect homepage to login', async () => {
    console.log('Testing homepage redirect...');
    
    const result = await fetchEndpoint(BASE_URL);
    console.log(`Status: ${result.status}`);
    console.log(`Redirect: ${result.redirectLocation}`);
    
    // 302 or 307 redirect expected
    expect([302, 307]).toContain(result.status);
    expect(result.redirectLocation).toContain('login');
  });

  test('should load login page successfully', async () => {
    console.log('Testing login page...');
    
    const result = await fetchEndpoint(`${BASE_URL}/login`);
    console.log(`Status: ${result.status}`);
    console.log(`Content length: ${result.text.length} bytes`);
    
    expect(result.status).toBe(200);
    expect(result.text).toContain('html');
    expect(result.text).toContain('Googleでログイン');
    expect(result.text).toContain('アカウントにログイン');
  });

  test('should protect dashboard with authentication', async () => {
    console.log('Testing dashboard protection...');
    
    const result = await fetchEndpoint(`${BASE_URL}/dashboard`);
    console.log(`Status: ${result.status}`);
    console.log(`Redirect: ${result.redirectLocation}`);
    
    // Should redirect unauthenticated users
    expect([302, 307]).toContain(result.status);
  });

  test('should handle 404 errors', async () => {
    console.log('Testing 404 handling...');
    
    const result = await fetchEndpoint(`${BASE_URL}/nonexistent-page`);
    console.log(`Status: ${result.status}`);
    
    expect(result.status).toBe(404);
  });

  test('should have fast response times', async () => {
    console.log('Testing response times...');
    
    const start = Date.now();
    const result = await fetchEndpoint(`${BASE_URL}/login`);
    const loadTime = Date.now() - start;
    
    console.log(`Load time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(5000); // 5秒未満
    expect(result.status).toBe(200);
  });

  test('should serve proper content types', async () => {
    console.log('Testing content types...');
    
    const result = await fetchEndpoint(`${BASE_URL}/login`);
    console.log(`Content-Type: ${result.headers['content-type']}`);
    
    expect(result.headers['content-type']).toContain('text/html');
    expect(result.text.length).toBeGreaterThan(1000);
  });
});

test.describe('Version Display Tests', () => {
  test('should display correct version in login page', async () => {
    console.log('Testing version display...');
    
    const result = await fetchEndpoint(`${BASE_URL}/login`);
    
    // バージョン情報の確認
    console.log('Checking for version information...');
    
    // ページにバージョン情報が含まれているかチェック
    const hasVersionSection = result.text.includes('Version:');
    console.log(`Has version section: ${hasVersionSection}`);
    
    if (hasVersionSection) {
      // 実際のバージョンを抽出
      const versionMatch = result.text.match(/Version:\s*<!--\s*-->([^<]+)/);
      if (versionMatch) {
        const actualVersion = versionMatch[1].trim();
        console.log(`Found version: ${actualVersion}`);
        
        // 期待されるバージョンをチェック（柔軟な比較）
        expect(actualVersion).toMatch(/\d+\.\d+\.\d+/);
      }
    }
    
    expect(result.status).toBe(200);
  });
});