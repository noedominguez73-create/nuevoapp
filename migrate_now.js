/**
 * Manual Phase 2 Migration - Add organization_id to existing tables
 * Run this once to update the database
 */

const { sequelize } = require('./src/config/database');

async function runMigration() {
    try {
        console.log('🔄 Starting Phase 2 Migration...\n');

        // Test connection
        console.log('1. Testing database connection...');
        await sequelize.authenticate();
        console.log('   ✅ Connected\n');

        // Add organization_id columns
        console.log('2. Adding organization_id columns...\n');

        const tables = ['users', 'salon_configs', 'mirror_items', 'api_configs'];

        for (const table of tables) {
            try {
                const query = `ALTER TABLE ${table} ADD COLUMN organization_id INT DEFAULT 1`;
                await sequelize.query(query);
                console.log(`   ✅ Added organization_id to ${table}`);
            } catch (err) {
                if (err.message.includes('Duplicate column') || err.message.includes('already exists')) {
                    console.log(`   ⏩ ${table}.organization_id already exists, skipping`);
                } else {
                    console.error(`   ❌ Error adding column to ${table}:`, err.message);
                    throw err;
                }
            }
        }

        console.log('\n3. Ensuring all records belong to Demo Salon (org 1)...');
        for (const table of tables) {
            await sequelize.query(`UPDATE ${table} SET organization_id = 1 WHERE organization_id IS NULL OR organization_id = 0`);
            console.log(`   ✅ Updated ${table}`);
        }

        console.log('\n🎉 Phase 2 Migration COMPLETE!\n');
        console.log('✅ All tables now have organization_id column');
        console.log('✅ All existing data assigned to Demo Salon (org_id: 1)');
        console.log('\nYou can now restart the server.\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Migration failed:');
        console.error('Error:', error.message);
        console.error('\nFull error:');
        console.error(error);
        process.exit(1);
    }
}

runMigration();
