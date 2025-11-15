const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3001', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log('Starting server...');

app.prepare().then(() => {
  console.log('Next.js prepared');
  
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Inicializuj Socket.io server
  try {
    console.log('Initializing Socket.io server...');
    const { initializeSocketServer } = require('./lib/socket-server.js');
    const io = initializeSocketServer(server);
    console.log('✅ Socket.io server initialized successfully');
    
    // Debug: Log když se někdo připojí
    io.on('connection', () => {
      console.log('🔌 New client connected');
    });
  } catch (error) {
    console.error('❌ Failed to initialize Socket.io server:', error);
    process.exit(1);
  }

  server
    .once('error', (err) => {
      console.error('❌ Server error:', err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`✅ Server ready on http://${hostname}:${port}`);
      console.log(`✅ Socket.io running`);
    });
}).catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});