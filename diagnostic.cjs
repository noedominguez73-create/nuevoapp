const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const info = {
        status: 'ALIVE',
        message: 'Diagnostic Server Running',
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
        env_port: process.env.PORT || 'Not Set (Using default 3000)',
        cwd: process.cwd(),
        memory: process.memoryUsage(),
        // Safe Environment Variables (excluding secrets)
        env_vars: Object.keys(process.env).filter(k => !k.includes('KEY') && !k.includes('PASS') && !k.includes('SECRET'))
    };
    res.end(JSON.stringify(info, null, 2));
});

server.listen(PORT, () => {
    console.log(`Diagnostic Server listening on port ${PORT}`);
});

// Prevent instant exit
process.on('uncaughtException', (err) => {
    console.error('Diagnostic Caught Exception:', err);
});
