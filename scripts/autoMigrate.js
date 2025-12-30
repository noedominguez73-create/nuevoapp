/**
 * Auto-Migration System
 * Verifica y ejecuta migraciones pendientes al arrancar el servidor
 */

const fs = require('fs');
const path = require('path');
const { sequelize } = require('../src/config/database');

const MIGRATION_FLAG_FILE = path.join(__dirname, '../.migration_phase2_done');

async function checkAndRunMigrations() {
    // Verificar si ya se ejecutó
    if (fs.existsSync(MIGRATION_FLAG_FILE)) {
        console.log('ℹ️  Migraciones ya ejecutadas previamente.');
        return;
    }

    console.log('🔄 Detectando primera ejecución post-migración...');
    console.log('🚀 Ejecutando Fase 2 automáticamente...\n');

    try {
        // Añadir organization_id a Users
        console.log('👤 Migrando tabla users...');
        await sequelize.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS organization_id INT,
            ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'end_customer'
        `);
        await sequelize.query(`UPDATE users SET organization_id = 1 WHERE organization_id IS NULL`);
        console.log('✅ users migrada');

        // Añadir organization_id a SalonConfigs
        console.log('⚙️  Migrando tabla salon_configs...');
        await sequelize.query(`ALTER TABLE salon_configs ADD COLUMN IF NOT EXISTS organization_id INT`);
        await sequelize.query(`UPDATE salon_configs SET organization_id = 1 WHERE organization_id IS NULL`);
        console.log('✅ salon_configs migrada');

        // Añadir organization_id a MirrorItems
        console.log('🎨 Migrando tabla mirror_items...');
        await sequelize.query(`ALTER TABLE mirror_items ADD COLUMN IF NOT EXISTS organization_id INT`);
        await sequelize.query(`UPDATE mirror_items SET organization_id = 1 WHERE organization_id IS NULL`);
        console.log('✅ mirror_items migrada');

        // Añadir organization_id a ApiConfigs
        console.log('🔑 Migrando tabla api_configs...');
        await sequelize.query(`ALTER TABLE api_configs ADD COLUMN IF NOT EXISTS organization_id INT`);
        await sequelize.query(`UPDATE api_configs SET organization_id = 1 WHERE organization_id IS NULL`);
        console.log('✅ api_configs migrada\n');

        // Marcar como completada
        fs.writeFileSync(MIGRATION_FLAG_FILE, new Date().toISOString());

        console.log('🎉 Fase 2 AUTO-MIGRACIÓN COMPLETADA!');
        console.log('✅ Todos los datos existentes ahora pertenecen a "Demo Salon"\n');

    } catch (error) {
        console.error('❌ Error en auto-migración:', error.message);
        console.error('⚠️  El servidor continuará funcionando con los datos existentes.');
    }
}

module.exports = { checkAndRunMigrations };
