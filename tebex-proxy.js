/**
 * Tebex API Proxy Server
 * =====================================
 * A simple Node.js proxy to fetch Tebex store listings without CORS issues.
 * 
 * SETUP:
 *   1. Install Node.js if you don't have it
 *   2. Edit the config below with your Tebex store URL and public token
 *   3. Run: node tebex-proxy.js
 *   4. In the website JS (script.js), set:
 *        SHOP_CONFIG.publicToken = 'your-token-here';
 *        SHOP_CONFIG.corsProxy = 'http://localhost:3001/api/tebex?url=';
 * 
 * The proxy will listen on port 3001 by default.
 */

const http = require('http');
const https = require('https');
const url = require('url');

// ===== CONFIGURATION =====
const PROXY_PORT = 3001;
const TEBEX_API_BASE = 'https://headless.tebex.io';
// =========================

const server = http.createServer((req, res) => {
    // CORS headers so the browser can call this proxy
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Tebex-Token');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Parse the proxied URL from query param
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;

    // Route: /api/tebex - proxy to Tebex Headless API
    if (pathname === '/api/tebex' && req.method === 'GET') {
        const targetUrl = parsed.query.url || '/api/listing';
        const tebexToken = parsed.query.token || '';

        // If no full URL provided, construct it
        const fullUrl = targetUrl.startsWith('http')
            ? targetUrl
            : TEBEX_API_BASE + (targetUrl.startsWith('/') ? targetUrl : '/' + targetUrl);

        console.log('[Tebex Proxy] Fetching:', fullUrl);

        const options = new url.URL(fullUrl);
        const proxyReq = https.request(
            {
                hostname: options.hostname,
                port: options.port || 443,
                path: options.pathname + options.search,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Oakridge-Shop-Proxy/1.0',
                    ...(tebexToken ? { 'X-Tebex-Token': tebexToken } : {})
                }
            },
            (proxyRes) => {
                let data = '';
                proxyRes.on('data', (chunk) => { data += chunk; });
                proxyRes.on('end', () => {
                    res.writeHead(proxyRes.statusCode, {
                        'Content-Type': 'application/json'
                    });
                    res.end(data);
                });
            }
        );

        proxyReq.on('error', (err) => {
            console.error('[Tebex Proxy] Error:', err.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        });

        proxyReq.end();
        return;
    }

    // Route: /api/health - simple health check
    if (pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
        return;
    }

    // 404 for everything else
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found. Use /api/tebex?url=/api/listing&token=YOUR_TOKEN' }));
});

server.listen(PROXY_PORT, () => {
    console.log('===========================================');
    console.log('  Tebex API Proxy Server');
    console.log('===========================================');
    console.log(`  Listening on: http://localhost:${PROXY_PORT}`);
    console.log(`  Listing API:  http://localhost:${PROXY_PORT}/api/tebex?url=/api/listing&token=YOUR_TOKEN`);
    console.log(`  Health check: http://localhost:${PROXY_PORT}/api/health`);
    console.log('');
    console.log('  To use in the website, set in script.js:');
    console.log('    SHOP_CONFIG.publicToken = "your-token";');
    console.log('    SHOP_CONFIG.corsProxy = "http://localhost:' + PROXY_PORT + '/api/tebex?url=";');
    console.log('===========================================');
});
