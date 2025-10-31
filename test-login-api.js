/**
 * Test Login API Directly
 */

const http = require('http');

const code = 'F3264E3D';

const postData = JSON.stringify({
  password: code
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/teacher-auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing login API...\n');
console.log('Code:', code);
console.log('');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  console.log('');

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response Body:');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
      
      if (json.success) {
        console.log('\n✅ Login successful!');
      } else {
        console.log('\n❌ Login failed');
        if (json.debug) {
          console.log('Debug info:', json.debug);
        }
      }
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.write(postData);
req.end();



