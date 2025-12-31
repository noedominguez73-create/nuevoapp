/**
 * Diagnostic v2 - Write full errors to file
 */

const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'diagnostic.log');
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

// Clear log
fs.writeFileSync(logFile, '=== DIAGNOSTIC START ===\n');

try {
    log('🔍 Test 1: Loading database config...');
    const { sequelize } = require('./src/config/database');
    log('✅ Database config loaded');

    log('\n🔍 Test 2: Testing database connection...');
    sequelize.authenticate()
        .then(() => {
            log('✅ Database connection successful!\n');
            log('🔍 Test 3: Syncing models...');
            return sequelize.sync({ alter: true });
        })
        .then(() => {
            log('✅ Models synced!');
            log('\n🎉 ALL TESTS PASSED!');
            log(`\nFull log saved to: ${logFile}`);
            process.exit(0);
        })
        .catch(err => {
            log('\n❌ ERROR DETAILS:');
            log('Name: ' + err.name);
            log('Message: ' + err.message);
            log('Code: ' + err.code);
            log('SQL State: ' + err.sqlState);
            log('\nFull stack:');
            log(err.stack);
            log(`\nFull log saved to: ${logFile}`);
            process.exit(1);
        });

} catch (error) {
    log('\n❌ CRITICAL ERROR:');
    log('Message: ' + error.message);
    log('\nStack trace:');
    log(error.stack);
    log(`\nFull log saved to: ${logFile}`);
    process.exit(1);
}
