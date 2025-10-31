/**
 * Test Rate Limiting Functionality
 * Submits multiple requests to test rate limit enforcement
 */

const http = require('http');

async function httpRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testRateLimit() {
  console.log('🧪 Testing Rate Limiting Functionality\n');
  console.log('='.repeat(60));
  console.log('\n📝 This test will submit multiple requests quickly');
  console.log('   Expected: First requests succeed, then rate limit kicks in');
  console.log('   Rate limit: 10 requests/hour, 50 requests/day\n');
  
  // Create a minimal valid test submission
  // Note: This uses a fake PIN/classToken - rate limiting should trigger before validation
  const testPayload = {
    classToken: 'TESTTOKEN',
    pin: 'TEST123',
    resultPayload: {
      cohort: 'YLA',
      topCareers: [{ slug: 'test', title: 'Test', score: 0.5 }],
      dimensionScores: {
        interests: 50,
        values: 50,
        workstyle: 50,
        context: 50
      }
    }
  };
  
  const results = [];
  const numRequests = 12; // Try 12 requests (should limit at 10)
  
  console.log(`📤 Submitting ${numRequests} requests...\n`);
  
  for (let i = 0; i < numRequests; i++) {
    try {
      const response = await httpRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/results',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, testPayload);
      
      const isRateLimited = response.status === 429;
      const isSuccess = response.status === 200 || response.status === 201;
      const isValidationError = response.status === 400;
      
      results.push({
        request: i + 1,
        status: response.status,
        rateLimited: isRateLimited,
        success: isSuccess,
        validationError: isValidationError,
        message: response.data.error || response.data.message || 'OK'
      });
      
      // Small delay to avoid overwhelming
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      results.push({
        request: i + 1,
        status: 'ERROR',
        error: error.message
      });
    }
  }
  
  // Analyze results
  console.log('📊 Results Analysis:\n');
  
  let successCount = 0;
  let rateLimitCount = 0;
  let validationErrorCount = 0;
  let errorCount = 0;
  
  results.forEach(result => {
    if (result.rateLimited) {
      rateLimitCount++;
      console.log(`   Request ${result.request}: 🔒 RATE LIMITED (429)`);
    } else if (result.success) {
      successCount++;
      console.log(`   Request ${result.request}: ✅ Success (${result.status})`);
    } else if (result.validationError) {
      validationErrorCount++;
      console.log(`   Request ${result.request}: ⚠️  Validation Error (400) - Rate limit not hit yet`);
    } else {
      errorCount++;
      console.log(`   Request ${result.request}: ❌ Error - ${result.error || result.message}`);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📈 Summary:');
  console.log(`   ✅ Successful requests: ${successCount}`);
  console.log(`   🔒 Rate limited requests: ${rateLimitCount}`);
  console.log(`   ⚠️  Validation errors: ${validationErrorCount}`);
  console.log(`   ❌ Other errors: ${errorCount}`);
  
  if (rateLimitCount > 0) {
    console.log('\n✅ Rate limiting is WORKING!');
    console.log('   Requests were successfully rate limited.');
  } else if (validationErrorCount > 0 && successCount === 0) {
    console.log('\n⚠️  Rate limiting may be working, but validation errors appear first');
    console.log('   This is expected - invalid requests fail validation before rate limiting');
    console.log('   To properly test, use valid PINs and classTokens');
  } else {
    console.log('\n⚠️  Rate limiting may not be active');
    console.log('   Check:');
    console.log('   1. Is rate limiting enabled in /api/results/route.ts?');
    console.log('   2. Is rate_limits table accessible?');
    console.log('   3. Check server logs for rate limit errors');
  }
  
  console.log('\n💡 Note: Rate limiting is based on hashed IP addresses');
  console.log('   Localhost tests may behave differently than production');
}

testRateLimit()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });



