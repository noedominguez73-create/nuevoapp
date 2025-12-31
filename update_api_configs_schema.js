const { sequelize } = require('./src/config/database');

(async () => {
    try {
        console.log('🔧 [FASE 1] Actualizando tabla api_configs...\n');

        // Check existing columns
        const [columns] = await sequelize.query(`
            SHOW COLUMNS FROM api_configs
        `);

        const columnNames = columns.map(c => c.Field);
        console.log('📋 Columnas actuales:', columnNames.join(', '));

        // Add provider_type
        if (!columnNames.includes('provider_type')) {
            console.log('\n➕ Agregando columna: provider_type...');
            await sequelize.query(`
                ALTER TABLE api_configs 
                ADD COLUMN provider_type ENUM('STUDIO', 'VERTEX') DEFAULT 'STUDIO' AFTER provider
            `);
            console.log('✅ provider_type agregada');
        } else {
            console.log('✅ provider_type ya existe');
        }

        // Add gcp_project_id
        if (!columnNames.includes('gcp_project_id')) {
            console.log('➕ Agregando columna: gcp_project_id...');
            await sequelize.query(`
                ALTER TABLE api_configs
                ADD COLUMN gcp_project_id VARCHAR(255) NULL AFTER api_key
            `);
            console.log('✅ gcp_project_id agregada');
        } else {
            console.log('✅ gcp_project_id ya existe');
        }

        // Add gcp_service_account_json
        if (!columnNames.includes('gcp_service_account_json')) {
            console.log('➕ Agregando columna: gcp_service_account_json...');
            await sequelize.query(`
                ALTER TABLE api_configs
                ADD COLUMN gcp_service_account_json TEXT NULL AFTER gcp_project_id
            `);
            console.log('✅ gcp_service_account_json agregada');
        } else {
            console.log('✅ gcp_service_account_json ya existe');
        }

        // Add gcp_location
        if (!columnNames.includes('gcp_location')) {
            console.log('➕ Agregando columna: gcp_location...');
            await sequelize.query(`
                ALTER TABLE api_configs
                ADD COLUMN gcp_location VARCHAR(50) DEFAULT 'us-central1' AFTER gcp_service_account_json
            `);
            console.log('✅ gcp_location agregada');
        } else {
            console.log('✅ gcp_location ya existe');
        }

        // Verify final structure
        console.log('\n📊 Verificando estructura final...');
        const [finalColumns] = await sequelize.query(`
            SHOW COLUMNS FROM api_configs
        `);

        console.log('\n✅ Columnas finales de api_configs:');
        finalColumns.forEach(col => {
            console.log(`   - ${col.Field} (${col.Type})`);
        });

        console.log('\n✅ FASE 1 COMPLETADA: Base de datos actualizada\n');

        process.exit(0);
    } catch (err) {
        console.error('\n❌ Error:', err.message);
        process.exit(1);
    }
})();
