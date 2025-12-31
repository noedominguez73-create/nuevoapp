const { sequelize } = require('./src/config/database');

(async () => {
    try {
        const [configs] = await sequelize.query(`
            SELECT id, provider, section, is_active
            FROM api_configs
            WHERE organization_id = 1
            ORDER BY section, provider
        `);

        console.log('\n═══════════════════════════════════════');
        console.log('      📋 API KEYS CONFIGURADAS');
        console.log('═══════════════════════════════════════\n');

        if (configs.length === 0) {
            console.log('❌ NO HAY NINGUNA API KEY CONFIGURADA\n');
        } else {
            configs.forEach((c, i) => {
                const status = c.is_active ? '✅ ACTIVA  ' : '❌ INACTIVA';
                console.log(`${i + 1}. ${status} | [${c.section.padEnd(8)}] | ${c.provider}`);
            });
        }

        console.log('\n═══════════════════════════════════════\n');

        // Check specifically for 'peinado' with Google
        const peinadoGoogle = configs.find(c =>
            c.section === 'peinado' &&
            c.provider === 'google' &&
            c.is_active
        );

        if (peinadoGoogle) {
            console.log('✅ API Key de Google para "peinado" está ACTIVA');
            console.log('   Debería funcionar la generación de prompts.');
        } else {
            console.log('❌ NO HAY API KEY DE GOOGLE ACTIVA PARA "PEINADO"');
            console.log('\n🔧 SOLUCIÓN:');
            console.log('   1. Abre: http://localhost:3000/admin-mirror');
            console.log('   2. Haz clic en "Configuración de Peinado" (candado 🔒)');
            console.log('   3. Agrega tu Google Gemini API Key');
            console.log('   4. Marca como activa');
        }

        console.log('\n═══════════════════════════════════════\n');

        process.exit(0);
    } catch (err) {
        console.error('\n❌ ERROR:', err.message);
        process.exit(1);
    }
})();
