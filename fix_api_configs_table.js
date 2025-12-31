const { sequelize } = require('./src/config/database');

(async () => {
    try {
        console.log('🔧 Agregando organization_id a api_configs...\n');

        // Check if column exists
        const [columns] = await sequelize.query(`
            SHOW COLUMNS FROM api_configs LIKE 'organization_id'
        `);

        if (columns.length > 0) {
            console.log('✅ La columna organization_id ya existe en api_configs');
        } else {
            console.log('➕ Agregando columna organization_id a api_configs...');
            await sequelize.query(`
                ALTER TABLE api_configs
                ADD COLUMN organization_id INT DEFAULT 1 NOT NULL
            `);
            console.log('✅ Columna agregada correctamente');

            // Update existing configs
            await sequelize.query(`
                UPDATE api_configs
                SET organization_id = 1
                WHERE organization_id IS NULL OR organization_id = 0
            `);
            console.log('✅ Configuraciones existentes actualizadas');
        }

        // Now check API keys
        const [configs] = await sequelize.query(`
            SELECT id, provider, section, is_active
            FROM api_configs
            WHERE organization_id = 1
        `);

        console.log(`\n📋 API Keys configuradas: ${configs.length}\n`);

        if (configs.length === 0) {
            console.log('❌ NO HAY API KEYS');
            console.log('\n🔑 NECESITAS AGREGAR UNA API KEY:');
            console.log('   1. Abre: http://localhost:3000/admin-mirror');
            console.log('   2. Haz clic en "Configuración de Peinado"');
            console.log('   3. Agrega tu Google Gemini API Key');
        } else {
            configs.forEach((c, i) => {
                const status = c.is_active ? '✅' : '❌';
                console.log(`   ${status} [${c.section}] ${c.provider}`);
            });

            const activeKey = configs.find(c => c.section === 'peinado' && c.is_active);
            if (activeKey) {
                console.log('\n✅ API Key de "peinado" está activa');
            } else {
                console.log('\n⚠️  Falta API Key activa para "peinado"');
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();
