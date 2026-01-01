// Test script to verify all imports work correctly
console.log('Testing imports...\n');

try {
    console.log('1. Database config...');
    const { sequelize } = require('./src/config/database.js');
    console.log('✅ Database config loaded\n');

    console.log('2. Finance Models...');
    const { FinanceAccount } = require('./src/models/FinanceAccount.js');
    console.log('✅ FinanceAccount loaded');

    const { FinanceTransaction } = require('./src/models/FinanceTransaction.js');
    console.log('✅ FinanceTransaction loaded');

    const { FinanceBill } = require('./src/models/FinanceBill.js');
    console.log('✅ FinanceBill loaded');

    const { FinanceReceivable, FinanceTodo, FinanceCategory } = require('./src/models/FinanceModels.js');
    console.log('✅ FinanceModels loaded\n');

    console.log('3. Closet Models...');
    const { ClosetItem } = require('./src/models/ClosetItem.js');
    console.log('✅ ClosetItem loaded\n');

    console.log('4. Models index...');
    const models = require('./src/models/index.js');
    console.log('✅ Models index loaded');
    console.log('Available models:', Object.keys(models).join(', '));
    console.log('\n✨ All imports successful!');
} catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
}
