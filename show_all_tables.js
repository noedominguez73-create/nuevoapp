/**  
 * Mostrar TODAS las tablas del proyecto
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('u182581262_appnode', 'root', '1020304050', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
});

async function showAllTables() {
    try {
        await sequelize.authenticate();

        // Obtener TODAS las tablas de la base de datos
        const [allTables] = await sequelize.query(`
            SELECT 
                TABLE_NAME,
                TABLE_ROWS,
                ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024, 2) as 'Size_KB',
                TABLE_COMMENT
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = 'u182581262_appnode'
            ORDER BY TABLE_NAME
        `);

        console.log('\n════════════════════════════════════════════════════════════════');
        console.log('  📊 TODAS LAS TABLAS EN LA BASE DE DATOS');
        console.log('════════════════════════════════════════════════════════════════\n');

        // Agrupar por sistema
        const finanzas = allTables.filter(t => t.TABLE_NAME.startsWith('finance_'));
        const closet = allTables.filter(t => t.TABLE_NAME.startsWith('closet_'));
        const mirror = allTables.filter(t => t.TABLE_NAME.startsWith('mirror_'));
        const otras = allTables.filter(t =>
            !t.TABLE_NAME.startsWith('finance_') &&
            !t.TABLE_NAME.startsWith('closet_') &&
            !t.TABLE_NAME.startsWith('mirror_')
        );

        // FINANZAS
        if (finanzas.length > 0) {
            console.log('💰 SISTEMA DE FINANZAS:');
            console.log('┌────────────────────────────┬──────────┬──────────┐');
            console.log('│ Tabla                      │ Filas    │ Tamaño   │');
            console.log('├────────────────────────────┼──────────┼──────────┤');
            finanzas.forEach(t => {
                const name = t.TABLE_NAME.padEnd(26);
                const rows = String(t.TABLE_ROWS || 0).padStart(8);
                const size = `${t.Size_KB} KB`.padStart(8);
                console.log(`│ ${name} │ ${rows} │ ${size} │`);
            });
            console.log('└────────────────────────────┴──────────┴──────────┘\n');
        }

        // CLOSET IA
        if (closet.length > 0) {
            console.log('👗 SISTEMA DE CLOSET IA:');
            console.log('┌────────────────────────────┬──────────┬──────────┐');
            console.log('│ Tabla                      │ Filas    │ Tamaño   │');
            console.log('├────────────────────────────┼──────────┼──────────┤');
            closet.forEach(t => {
                const name = t.TABLE_NAME.padEnd(26);
                const rows = String(t.TABLE_ROWS || 0).padStart(8);
                const size = `${t.Size_KB} KB`.padStart(8);
                console.log(`│ ${name} │ ${rows} │ ${size} │`);
            });
            console.log('└────────────────────────────┴──────────┴──────────┘\n');
        }

        // MIRROR IA
        if (mirror.length > 0) {
            console.log('🪞 SISTEMA DE MIRROR IA:');
            console.log('┌────────────────────────────┬──────────┬──────────┐');
            console.log('│ Tabla                      │ Filas    │ Tamaño   │');
            console.log('├────────────────────────────┼──────────┼──────────┤');
            mirror.forEach(t => {
                const name = t.TABLE_NAME.padEnd(26);
                const rows = String(t.TABLE_ROWS || 0).padStart(8);
                const size = `${t.Size_KB} KB`.padStart(8);
                console.log(`│ ${name} │ ${rows} │ ${size} │`);
            });
            console.log('└────────────────────────────┴──────────┴──────────┘\n');
        }

        // OTRAS (Core del sistema)
        if (otras.length > 0) {
            console.log('⚙️  SISTEMA CORE (Usuarios, Auth, etc):');
            console.log('┌────────────────────────────┬──────────┬──────────┐');
            console.log('│ Tabla                      │ Filas    │ Tamaño   │');
            console.log('├────────────────────────────┼──────────┼──────────┤');
            otras.forEach(t => {
                const name = t.TABLE_NAME.padEnd(26);
                const rows = String(t.TABLE_ROWS || 0).padStart(8);
                const size = `${t.Size_KB} KB`.padStart(8);
                console.log(`│ ${name} │ ${rows} │ ${size} │`);
            });
            console.log('└────────────────────────────┴──────────┴──────────┘\n');
        }

        console.log('════════════════════════════════════════════════════════════════');
        console.log(`  📊 TOTAL: ${allTables.length} tablas en la base de datos`);
        console.log('════════════════════════════════════════════════════════════════\n');

        // Verificar user_id en tablas importantes
        console.log('🔍 Tablas con separación por usuario (user_id):\n');

        const tablasConUserId = [...finanzas, ...closet].map(t => t.TABLE_NAME);

        for (const tableName of tablasConUserId) {
            try {
                const [cols] = await sequelize.query(`DESCRIBE ${tableName}`);
                const hasUserId = cols.some(c => c.Field === 'user_id');
                const status = hasUserId ? '✅' : '❌';
                console.log(`   ${status} ${tableName}`);
            } catch (e) {
                console.log(`   ⚠️  ${tableName} - Error: ${e.message}`);
            }
        }

        console.log('\n════════════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

showAllTables();
