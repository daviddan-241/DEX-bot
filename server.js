const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'alive',
      bot: 'Dex Boosting Bot',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`🌐 Keep-alive server running on port ${PORT}`);
});

module.exports = server;
