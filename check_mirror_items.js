const { sequelize } = require('./src/config/database');

(async () => {
    try {
        console.log('🔍 Verificando items de peinados...\n');

        const [items] = await sequelize.query(`
            SELECT id, name, category, organization_id, created_at
            FROM mirror_items
            ORDER BY created_at DESC
            LIMIT 10
        `);

        if (items.length === 0) {
            console.log('❌ No hay items en la base de datos');
        } else {
            console.log(`✅ ${items.length} items encontrados:\n`);
            items.forEach((item, i) => {
                console.log(`${i + 1}. "${item.name}" - ${item.category} - Org: ${item.organization_id} - ${item.created_at}`);
            });
        }

        // Ver usuario actual
        const [users] = await sequelize.query(`
            SELECT email, role, organization_id
            FROM users
            WHERE email = 'salon@gmail.com'
        `);

        if (users.length > 0) {
            console.log(`\n👤 Usuario salon@gmail.com:`);
            console.log(`   Role: ${users[0].role}`);
            console.log(`   Organization ID: ${users[0].organization_id}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();
