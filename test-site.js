const https = require('https');
const http = require('http');

const BASE_URL = 'https://dainage2.vercel.app';

console.log('🧪 Testing Toggl Clone v13.0.0');
console.log('=' .repeat(50));

// Test function
async function testEndpoint(url, expectedStatus = 200) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    https.get(url, (res) => {
      const loadTime = Date.now() - startTime;
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const result = {
          url,
          status: res.statusCode,
          loadTime,
          headers: res.headers,
          contentLength: data.length,
          hasContent: data.length > 0,
          hasHtml: data.includes('<html'),
          hasTitle: data.includes('<title>'),
          hasVersion: data.includes('v13.0.0'),
          hasEmberaldColor: data.includes('emerald') || data.includes('#059669'),
          redirectLocation: res.headers.location
        };
        
        resolve(result);
      });
    }).on('error', reject);
  });
}

async function runTests() {
  try {
    console.log('📍 Testing Homepage (should redirect to login)');
    const homepageResult = await testEndpoint(BASE_URL);
    console.log(`   Status: ${homepageResult.status}`);
    console.log(`   Load Time: ${homepageResult.loadTime}ms`);
    console.log(`   Content Length: ${homepageResult.contentLength} bytes`);
    
    if (homepageResult.status === 307 || homepageResult.status === 302) {
      console.log(`   ✅ Redirect working: ${homepageResult.redirectLocation}`);
    }
    
    console.log('');
    console.log('📍 Testing Login Page');
    const loginResult = await testEndpoint(`${BASE_URL}/login`);
    console.log(`   Status: ${loginResult.status}`);
    console.log(`   Load Time: ${loginResult.loadTime}ms`);
    console.log(`   Content Length: ${loginResult.contentLength} bytes`);
    console.log(`   Has HTML: ${loginResult.hasHtml}`);
    console.log(`   Has Title: ${loginResult.hasTitle}`);
    
    if (loginResult.status === 200 && loginResult.hasHtml) {
      console.log('   ✅ Login page loads correctly');
    }
    
    console.log('');
    console.log('📍 Testing Dashboard Page (requires auth)');
    const dashboardResult = await testEndpoint(`${BASE_URL}/dashboard`);
    console.log(`   Status: ${dashboardResult.status}`);
    console.log(`   Load Time: ${dashboardResult.loadTime}ms`);
    
    if (dashboardResult.status === 307 || dashboardResult.status === 302) {
      console.log('   ✅ Dashboard properly protected with auth redirect');
    }
    
    console.log('');
    console.log('📍 Testing 404 Handling');
    const notFoundResult = await testEndpoint(`${BASE_URL}/nonexistent-page`);
    console.log(`   Status: ${notFoundResult.status}`);
    console.log(`   Load Time: ${notFoundResult.loadTime}ms`);
    
    console.log('');
    console.log('📊 Performance Summary');
    console.log(`   Homepage Load: ${homepageResult.loadTime}ms`);
    console.log(`   Login Load: ${loginResult.loadTime}ms`);
    console.log(`   Dashboard Load: ${dashboardResult.loadTime}ms`);
    
    const avgLoadTime = (homepageResult.loadTime + loginResult.loadTime + dashboardResult.loadTime) / 3;
    console.log(`   Average Load Time: ${Math.round(avgLoadTime)}ms`);
    
    if (avgLoadTime < 2000) {
      console.log('   ✅ Excellent performance (< 2s)');
    } else if (avgLoadTime < 5000) {
      console.log('   ✅ Good performance (< 5s)');
    } else {
      console.log('   ⚠️ Slow performance (> 5s)');
    }
    
    console.log('');
    console.log('🎯 Test Results Summary');
    console.log('=' .repeat(50));
    
    const tests = [
      { name: 'Homepage Redirect', pass: homepageResult.status === 307 || homepageResult.status === 302 },
      { name: 'Login Page Load', pass: loginResult.status === 200 && loginResult.hasHtml },
      { name: 'Dashboard Auth Protection', pass: dashboardResult.status === 307 || dashboardResult.status === 302 },
      { name: 'Fast Loading (<5s)', pass: avgLoadTime < 5000 },
      { name: 'HTTPS Working', pass: true },
      { name: 'Content Served', pass: loginResult.contentLength > 1000 }
    ];
    
    tests.forEach(test => {
      console.log(`   ${test.pass ? '✅' : '❌'} ${test.name}`);
    });
    
    const passedTests = tests.filter(t => t.pass).length;
    console.log('');
    console.log(`🎉 ${passedTests}/${tests.length} tests passed`);
    
    if (passedTests === tests.length) {
      console.log('🚀 All tests passed! Site is working correctly.');
    } else {
      console.log('⚠️ Some tests failed. Please check the results above.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
runTests();