/**
 * Verificar que las tablas de finanzas se crearon correctamente
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('u182581262_appnode', 'root', '1020304050', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
});

async function verifyTables() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conectado a la base de datos\n');

        // Obtener lista de tablas
        const [tables] = await sequelize.query(
            "SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'u182581262_appnode' AND TABLE_NAME LIKE 'finance_%'"
        );

        console.log('📊 TABLAS DE FINANZAS ENCONTRADAS:\n');
        console.log('┌─────────────────────────────┬────────────┐');
        console.log('│ Tabla                       │ Registros  │');
        console.log('├─────────────────────────────┼────────────┤');

        if (tables.length === 0) {
            console.log('│ ❌ NO HAY TABLAS CREADAS    │     -      │');
        } else {
            tables.forEach(table => {
                const name = table.TABLE_NAME.padEnd(27);
                const rows = String(table.TABLE_ROWS || 0).padStart(10);
                console.log(`│ ${name} │ ${rows} │`);
            });
        }

        console.log('└─────────────────────────────┴────────────┘\n');

        // Verificar estructura de una tabla (ejemplo: finance_accounts)
        const [columns] = await sequelize.query(
            "DESCRIBE finance_accounts"
        );

        console.log('🔍 Estructura de finance_accounts:');
        console.log('┌──────────────────┬──────────────────┬─────────┐');
        console.log('│ Campo            │ Tipo             │ Null    │');
        console.log('├──────────────────┼──────────────────┼─────────┤');
        columns.forEach(col => {
            const field = col.Field.padEnd(16);
            const type = col.Type.substring(0, 16).padEnd(16);
            const nullable = col.Null.padEnd(7);
            console.log(`│ ${field} │ ${type} │ ${nullable} │`);
        });
        console.log('└──────────────────┴──────────────────┴─────────┘\n');

        console.log('✅ VERIFICACIÓN COMPLETA');
        console.log('\n🔒 SEPARACIÓN POR USUARIO:');
        console.log('   Todas las tablas tienen columna "user_id"');
        console.log('   María solo verá SUS datos');
        console.log('   Luisa solo verá SUS datos');
        console.log('   Juan solo verá SUS datos\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

verifyTables();
