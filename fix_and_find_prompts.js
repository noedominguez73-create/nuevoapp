const { sequelize } = require('./src/config/database');

(async () => {
    try {
        console.log('🔧 Añadiendo organization_id a salon_configs...\n');

        // Primero, verificar  si existe
        try {
            const [columns] = await sequelize.query(`SHOW COLUMNS FROM salon_configs`);
            const hasOrgId = columns.some(col => col.Field === 'organization_id');

            if (!hasOrgId) {
                console.log('❌ organization_id falta, agregándola...');
                await sequelize.query(`ALTER TABLE salon_configs ADD COLUMN organization_id INT DEFAULT 1`);
                console.log('✅ Columna agregada\n');
            } else {
                console.log('✅ organization_id ya existe\n');
            }
        } catch (e) {
            console.error('Error:', e.message);
        }

        // Ahora buscar prompts
        console.log('📋 Buscando prompts en salon_configs...\n');
        const [configs] = await sequelize.query(`
            SELECT id, user_id, organization_id,
                   hairstyle_sys_prompt, color_sys_prompt
            FROM salon_configs
            WHERE organization_id = 1
        `);

        if (configs.length === 0) {
            console.log('❌ No hay configuración para organización 1\n');
            console.log('Creando configuración con prompts por defecto...\n');

            const hairstylePrompt = `Eres un experto estilista de cabello. Describe este peinado de manera detallada y profesional.`;
            const colorPrompt = `Eres un experto colorista de cabello. Describe este tono/color de manera profesional.`;

            await sequelize.query(`
                INSERT INTO salon_configs (user_id, organization_id, hairstyle_sys_prompt, color_sys_prompt)
                VALUES (1, 1, ?, ?)
            `, { replacements: [hairstylePrompt, colorPrompt] });

            console.log('✅ Configuración creada');
        } else {
            console.log(`✅ ${configs.length} configuración(es) encontradas:\n`);
            configs.forEach(c => {
                console.log(`ID: ${c.id}`);
                console.log(`Hairstyle Prompt: ${c.hairstyle_sys_prompt ? '✅ (' + c.hairstyle_sys_prompt.substring(0, 60) + '...)' : '❌ Vacío'}`);
                console.log(`Color Prompt: ${c.color_sys_prompt ? '✅ (' + c.color_sys_prompt.substring(0, 60) + '...)' : '❌ Vacío'}`);
                console.log('');
            });
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();
