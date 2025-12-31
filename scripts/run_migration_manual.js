/**
 * Manual Phase 2 Migration - Add organization_id to existing tables
 * Run this once to update the database
 */

const { sequelize } = require('../src/config/database');

async function runMigration() {
    try {
        console.log('🔄 Starting Phase 2 Migration...\n');

        // Test connection
        console.log('1. Testing database connection...');
        await sequelize.authenticate();
        console.log('   ✅ Connected\n');

        // Add organization_id columns if they don't exist
        console.log('2. Adding organization_id columns...');

        const queries = [
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id INT DEFAULT 1`,
            `ALTER TABLE salon_configs ADD COLUMN IF NOT EXISTS organization_id INT DEFAULT 1`,
            `ALTER TABLE mirror_items ADD COLUMN IF NOT EXISTS organization_id INT DEFAULT 1`,
            `ALTER TABLE api_configs ADD COLUMN IF NOT EXISTS organization_id INT DEFAULT 1`
        ];

        for (const query of queries) {
            try {
                await sequelize.query(query);
                console.log('   ✅', query.substring(0, 50) + '...');
            } catch (err) {
                if (err.message.includes('Duplicate column')) {
                    console.log('   ⏩ Column already exists, skipping');
                } else {
                    throw err;
                }
            }
        }

        console.log('\n3. Updating existing records to org_id = 1...');
        await sequelize.query(`UPDATE users SET organization_id = 1 WHERE organization_id IS NULL`);
        await sequelize.query(`UPDATE salon_configs SET organization_id = 1 WHERE organization_id IS NULL`);
        await sequelize.query(`UPDATE mirror_items SET organization_id = 1 WHERE organization_id IS NULL`);
        await sequelize.query(`UPDATE api_configs SET organization_id = 1 WHERE organization_id IS NULL`);
        console.log('   ✅ All records assigned to Demo Salon (org 1)\n');

        console.log('🎉 Phase 2 Migration COMPLETE!\n');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Migration failed:');
        console.error('Error:', error.message);
        console.error('\nStack:', error.stack);
        process.exit(1);
    }
}

runMigration();
