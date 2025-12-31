const { sequelize } = require('./src/config/database');

(async () => {
    try {
        console.log('🔑 Guardando API Key de Google Gemini...\n');

        const apiKey = 'AIzaSyBR-HDUHl9zLUOHuUTsHVIU_aw2QBxvhnA';
        const section = 'peinado';
        const provider = 'google';
        const alias = 'Gemini Vision';

        // Check if already exists
        const [existing] = await sequelize.query(`
            SELECT id, is_active FROM api_configs
            WHERE section = ? AND provider = ? AND organization_id = 1
        `, {
            replacements: [section, provider]
        });

        if (existing.length > 0) {
            console.log('⚠️  Ya existe una configuración, actualizando...');
            await sequelize.query(`
                UPDATE api_configs
                SET api_key = ?, alias = ?, is_active = 1
                WHERE id = ?
            `, {
                replacements: [apiKey, alias, existing[0].id]
            });
            console.log('✅ API Key actualizada correctamente');
        } else {
            console.log('➕ Creando nueva configuración...');
            await sequelize.query(`
                INSERT INTO api_configs (provider, section, api_key, alias, is_active, organization_id)
                VALUES (?, ?, ?, ?, 1, 1)
            `, {
                replacements: [provider, section, apiKey, alias]
            });
            console.log('✅ API Key guardada correctamente');
        }

        // Verify
        const [result] = await sequelize.query(`
            SELECT id, provider, section, alias, is_active,
                   CONCAT(LEFT(api_key, 10), '...', RIGHT(api_key, 5)) as masked_key
            FROM api_configs
            WHERE section = 'peinado' AND organization_id = 1
        `);

        console.log('\n📋 Configuración guardada:\n');
        result.forEach(r => {
            const status = r.is_active ? '✅ ACTIVA' : '❌ Inactiva';
            console.log(`   ${status}`);
            console.log(`   Provider: ${r.provider}`);
            console.log(`   Section: ${r.section}`);
            console.log(`   Alias: ${r.alias}`);
            console.log(`   Key: ${r.masked_key}`);
        });

        console.log('\n✅ ¡Listo! Ahora puedes probar subir una imagen de peinado.\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();
