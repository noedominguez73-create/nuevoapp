const { sequelize } = require('./src/config/database');

(async () => {
    try {
        console.log('🔧 Configurando Google AI Studio como provider...\n');

        // Actualizar configuración a STUDIO
        await sequelize.query(`
            UPDATE api_configs
            SET provider_type = 'STUDIO'
            WHERE organization_id = 1 AND section = 'peinado'
        `);

        console.log('✅ Provider actualizado a: STUDIO');

        // Verificar configuración
        const [config] = await sequelize.query(`
            SELECT id, section, provider_type, 
                   CONCAT(LEFT(api_key, 10), '...') as masked_key,
                   is_active
            FROM api_configs
            WHERE organization_id = 1 AND section = 'peinado'
        `);

        if (config.length > 0) {
            console.log('\n📋 Configuración actual:');
            console.log('   Section:', config[0].section);
            console.log('   Provider:', config[0].provider_type);
            console.log('   API Key:', config[0].masked_key);
            console.log('   Active:', config[0].is_active ? '✅ Sí' : '❌ No');
        }

        console.log('\n✅ Sistema configurado con Google AI Studio');
        console.log('💡 Ahora puedes probar subiendo una imagen de peinado\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();
