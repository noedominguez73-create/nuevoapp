/**
 * Diagnostic Script - Capture Full Server Startup Errors
 * Run this to see complete error messages
 */

console.log('🔍 Starting diagnostic mode...\n');

try {
    // Test 1: Database config
    console.log('Test 1: Loading database config...');
    const { sequelize } = require('./src/config/database');
    console.log('✅ Database config loaded\n');

    // Test 2: Organization middleware
    console.log('Test 2: Loading organization middleware...');
    const { getOrganizationId } = require('./src/middleware/organizationMiddleware');
    console.log('✅ Organization middleware loaded\n');

    // Test 3: Auto-migrate script
    console.log('Test 3: Loading auto-migrate script...');
    const { checkAndRunMigrations } = require('./scripts/autoMigrate');
    console.log('✅ Auto-migrate script loaded\n');

    // Test 4: Mirror routes
    console.log('Test 4: Loading mirror routes...');
    const mirrorRoutes = require('./src/routes/mirrorRoutes');
    console.log('✅ Mirror routes loaded\n');

    // Test 5: Try to authenticate database
    console.log('Test 5: Testing database connection...');
    sequelize.authenticate()
        .then(() => {
            console.log('✅ Database connection successful\n');

            // Test 6: Try server startup
            console.log('Test 6: Starting server...');
            require('./server');
        })
        .catch(err => {
            console.error('❌ Database connection failed:');
            console.error('Error name:', err.name);
            console.error('Error message:', err.message);
            console.error('Full error:', err);
            process.exit(1);
        });

} catch (error) {
    console.error('\n❌ DIAGNOSTIC FAILED AT:', error.message);
    console.error('\nFull stack trace:');
    console.error(error.stack);
    process.exit(1);
}
