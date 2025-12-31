const { sequelize } = require('./src/config/database');

(async () => {
    try {
        console.log('🔍 Checking table structure...\n');

        // Ver estructura de users
        const [columns] = await sequelize.query(`SHOW COLUMNS FROM users`);
        console.log('📋 Columns in users table:');
        columns.forEach(col => {
            console.log(`   - ${col.Field} (${col.Type})`);
        });

        const hasOrgId = columns.some(col => col.Field === 'organization_id');

        if (!hasOrgId) {
            console.log('\n❌ organization_id column MISSING! Adding it now...');
            await sequelize.query(`ALTER TABLE users ADD COLUMN organization_id INT DEFAULT 1`);
            console.log('✅ Column added');
        } else {
            console.log('\n✅ organization_id column exists');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();
