const { sequelize } = require('./src/config/database');

(async () => {
    try {
        console.log('🔧 Agregando organization_id a mirror_items...\n');

        // Check if column exists
        const [columns] = await sequelize.query(`
            SHOW COLUMNS FROM mirror_items LIKE 'organization_id'
        `);

        if (columns.length > 0) {
            console.log('✅ La columna organization_id ya existe');
        } else {
            console.log('➕ Agregando columna organization_id...');
            await sequelize.query(`
                ALTER TABLE mirror_items
                ADD COLUMN organization_id INT DEFAULT 1 NOT NULL
            `);
            console.log('✅ Columna agregada correctamente');

            // Update existing items to organization 1
            await sequelize.query(`
                UPDATE mirror_items
                SET organization_id = 1
                WHERE organization_id IS NULL OR organization_id = 0
            `);
            console.log('✅ Items existentes actualizados a organization_id = 1');
        }

        // Verify
        const [items] = await sequelize.query(`
            SELECT id, name, category, organization_id
            FROM mirror_items
            ORDER BY id DESC
            LIMIT 5
        `);

        console.log('\n📋 Items actuales:');
        items.forEach(item => {
            console.log(`   ${item.id}. "${item.name}" - ${item.category} - Org: ${item.organization_id}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();
