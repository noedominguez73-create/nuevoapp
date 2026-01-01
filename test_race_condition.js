// Test if models are ready BEFORE routes try to use them
const express = require('express');
const app = express();
const { sequelize } = require('./src/config/database');

console.log('\n🧪 TESTING MODEL INITIALIZATION RACE CONDITION\n');

// SCENARIO 1: What server.js does now (OPTIMISTIC STARTUP)
console.log('📍 STEP 1: Setting up routes IMMEDIATELY (like server.js does)');
const closetRoutes = require('./src/routes/closetRoutes');
const financeRoutes = require('./src/routes/financeRoutes');
app.use('/api/closet', closetRoutes);
app.use('/api/finance', financeRoutes);
console.log('✅ Routes registered');

console.log('\n📍 STEP 2: Starting server on port 3001');
const server = app.listen(3001, () => {
    console.log('✅ Server listening on port 3001');
});

console.log('\n📍 STEP 3: Connecting database IN BACKGROUND (async)');
(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database authenticated');

        await sequelize.sync();
        console.log('✅ Models synced');

        console.log('\n🔬 TESTING API CALL AFTER SYNC:');
        const { ClosetItem } = require('./src/models/index');
        const items = await ClosetItem.findAll({ where: { user_id: 1 } });
        console.log(`✅ Direct query works: ${items.length} items`);

        // Make a test HTTP request
        const http = require('http');
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/closet/items',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM1NjY0MjkyfQ.xyz'  // Fake token for testing
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log('\n📡 HTTP API Response:');
                console.log(`   Status: ${res.statusCode}`);
                console.log(`   Body: ${data.substring(0, 200)}`);

                server.close();
                process.exit(0);
            });
        });

        req.on('error', (e) => {
            console.error(`❌ Request error: ${e.message}`);
            server.close();
            process.exit(1);
        });

        req.end();

    } catch (error) {
        console.error('\n❌ Error during sync:', error.message);
        server.close();
        process.exit(1);
    }
})();

console.log('\n💡 KEY OBSERVATION:');
console.log('   Routes are loaded BEFORE sequelize.sync() completes');
console.log('   This creates a race condition if models aren\'t pre-registered');
