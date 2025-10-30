// Force release port 3000 by attempting to bind to it
const net = require('net');

const server = net.createServer();

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Port 3000 is in use. Attempting to free it...');
    // Try to connect and close the connection to the stuck port
    const client = net.createConnection({ port: 3000 }, () => {
      console.log('Connected to port 3000 - closing connection...');
      client.destroy();
    });
    
    client.on('error', (err) => {
      console.log('Cannot connect:', err.message);
    });
    
    setTimeout(() => {
      console.log('Port may still be stuck. Please manually kill process 57580.');
      process.exit(1);
    }, 2000);
  }
});

server.listen(3000, () => {
  console.log('✅ Port 3000 is now available!');
  server.close(() => {
    console.log('Port released - you can now start Next.js');
    process.exit(0);
  });
});


