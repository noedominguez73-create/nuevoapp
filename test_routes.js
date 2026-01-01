// Minimal server test
try {
    console.log('Loading setupRoutes...');
    const { setupRoutes } = require('./src/routes/index.js');
    console.log('✅ setupRoutes loaded');
    console.log('typeof setupRoutes:', typeof setupRoutes);
} catch (error) {
    console.error('FULL ERROR:');
    console.error(error);
    process.exit(1);
}
