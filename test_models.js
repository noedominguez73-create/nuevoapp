const { sequelize } = require('./src/config/database');
const { FinanceAccount, FinanceTransaction, FinanceBill, ClosetItem } = require('./src/models/index');

(async () => {
    try {
        console.log('🔌 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connected');

        console.log('\n🔄 Syncing models...');
        await sequelize.sync();
        console.log('✅ Models synced');

        console.log('\n📊 Testing ClosetItem model...');
        const closetItems = await ClosetItem.findAll({ where: { user_id: 1 } });
        console.log(`✅ ClosetItem.findAll() succeeded - Found ${closetItems.length} items`);

        console.log('\n📊 Testing FinanceAccount model...');
        const accounts = await FinanceAccount.findAll({ where: { user_id: 1 } });
        console.log(`✅ FinanceAccount.findAll() succeeded - Found ${accounts.length} accounts`);

        console.log('\n📊 Testing FinanceTransaction model...');
        const transactions = await FinanceTransaction.findAll({ where: { user_id: 1 } });
        console.log(`✅ FinanceTransaction.findAll() succeeded - Found ${transactions.length} transactions`);

        console.log('\n📊 Testing FinanceBill model...');
        const bills = await FinanceBill.findAll({ where: { user_id: 1 } });
        console.log(`✅ FinanceBill.findAll() succeeded - Found ${bills.length} bills`);

        console.log('\n✅ ALL TESTS PASSED!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ TEST FAILED:');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
})();
