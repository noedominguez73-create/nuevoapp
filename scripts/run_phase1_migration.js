// Script para ejecutar la migración Fase 1: Multi-Tenant
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1020304050',
        database: 'asesoria_db',
        multipleStatements: true
    });

    try {
        console.log('📦 Conectado a la base de datos...');

        const sqlPath = path.join(__dirname, '../.gemini/antigravity/brain/c14a6f61-5075-4884-bb8f-b40f597fb1dd/phase1_multi_tenant_tables.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Ejecutando migración...');
        const [results] = await connection.query(sql);

        console.log('✅ Migración completada exitosamente!');
        console.log('📊 Resultados:', results);

    } catch (error) {
        console.error('❌ Error en migración:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

runMigration()
    .then(() => {
        console.log('\n✨ Todo listo! Las nuevas tablas multi-tenant fueron creadas.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n💥 Migración falló:', err);
        process.exit(1);
    });
