// Generate a valid JWT token for user ID 1 (admin)
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

const token = jwt.sign(
    { id: 1, role: 'admin', email: 'admin@imagina.ia' },
    JWT_SECRET,
    { expiresIn: '24h' }
);

console.log('\n🔑 VALID JWT TOKEN FOR TESTING:\n');
console.log(token);
console.log('\n💡 Use this token in Authorization header:');
console.log(`Bearer ${token}\n`);

// Test the API with this token
const http = require('http');

const testAPI = (path, description) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log(`\n📡 ${description}`);
                console.log(`   Status: ${res.statusCode}`);
                console.log(`   Body: ${data.substring(0, 500)}`);
                resolve({ status: res.statusCode, body: data });
            });
        });

        req.on('error', (e) => {
            console.error(`❌ Request error: ${e.message}`);
            reject(e);
        });

        req.end();
    });
};

(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for server to start

    try {
        await testAPI('/api/closet/items', 'Closet API Test');
        await testAPI('/api/finance/data', 'Finance API Test');
        await testAPI('/api/finance/accounts', 'Finance Accounts Test');

        console.log('\n✅ All API tests completed\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
})();
