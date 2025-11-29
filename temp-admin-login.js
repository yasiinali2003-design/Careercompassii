// Temporary script to authenticate admin
const password = 'CCYHAHAIKUNZIBBI22!';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

console.log('Attempting to authenticate admin...');
console.log('Password:', password);
console.log('Base URL:', baseUrl);

// This would need to be run from the browser console or via a fetch request
console.log('\nTo authenticate, visit: http://localhost:3000/admin/login');
console.log('Or use this in browser console:');
console.log(`
fetch('/api/admin/auth-helper', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: '${password}' }),
  credentials: 'include'
}).then(r => r.json()).then(console.log).then(() => window.location.href = '/admin/school-dashboard');
`);
