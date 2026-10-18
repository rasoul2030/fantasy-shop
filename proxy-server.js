const http = require('http');
const httpProxy = require('http-proxy');

// Actually, http-proxy might not be available. Let's use a simple approach.
const TARGET_PORT = 3000;
const LISTEN_PORT = parseInt(process.env.FC_CUSTOM_LISTEN_PORT || '81', 10);

const server = http.createServer((req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    res.writeHead(502);
    res.end('Bad Gateway');
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(LISTEN_PORT, '0.0.0.0', () => {
  console.log(`Proxy listening on port ${LISTEN_PORT} -> ${TARGET_PORT}`);
});
