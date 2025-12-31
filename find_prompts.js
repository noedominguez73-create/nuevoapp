const { sequelize } = require('./src/config/database');

(async () => {
    try {
        console.log('🔍 Buscando prompts en la base de datos...\n');

        // Ver si hay configuración con prompts
        const [configs] = await sequelize.query(`
            SELECT id, user_id, organization_id, 
                   hairstyle_sys_prompt, color_sys_prompt,
                   created_at
            FROM salon_configs
        `);

        if (configs.length === 0) {
            console.log('❌ No se encontraron configuraciones en la base de datos');
            console.log('\n📋 Creando configuración con prompts por defecto...\n');

            const defaultHairstylePrompt = `Eres un experto estilista de cabello. Describe este peinado de manera detallada y profesional, incluyendo:
- Técnica de corte o peinado
- Textura y volumen
- Forma y contorno
- Estilo general (moderno, clásico, casual, formal)
- Detalles específicos que lo hacen único

Sé específico pero conciso. Máximo 3 párrafos.`;

            const defaultColorPrompt = `Eres un experto colorista de cabello. Describe este tono/color de cabello de manera profesional, incluyendo:
- Tono base y matices
- Nivel de claridad (oscuro, medio, claro)
- Técnica de aplicación (balayage, mechas, tinte completo, etc.)
- Reflejos y profundidad
- Estilo y look general que transmite

Sé específico pero conciso. Máximo 3 párrafos.`;

            await sequelize.query(`
                INSERT INTO salon_configs 
                (user_id, organization_id, hairstyle_sys_prompt, color_sys_prompt)
                VALUES (1, 1, ?, ?)
            `, {
                replacements: [defaultHairstylePrompt, defaultColorPrompt]
            });

            console.log('✅ Configuración creada con prompts por defecto');
        } else {
            console.log(`✅ Encontradas ${configs.length} configuraciones:\n`);

            configs.forEach((config, i) => {
                console.log(`Configuración #${i + 1}:`);
                console.log(`  ID: ${config.id}`);
                console.log(`  User ID: ${config.user_id}`);
                console.log(`  Org ID: ${config.organization_id}`);
                console.log(`  Hairstyle Prompt: ${config.hairstyle_sys_prompt ? '✅ Existe (' + config.hairstyle_sys_prompt.substring(0, 50) + '...)' : '❌ Vacío'}`);
                console.log(`  Color Prompt: ${config.color_sys_prompt ? '✅ Existe (' + config.color_sys_prompt.substring(0, 50) + '...)' : '❌ Vacío'}`);
                console.log('');
            });
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();
