const { sequelize } = require('./src/config/database');

const DEFAULT_HAIRSTYLE_PROMPT = `Eres un estilista experto en cabello. Analiza esta imagen de peinado y proporciona una descripción detallada que incluya:

1. **Técnica y Corte:**
   - Tipo de corte (capas, recto, degradado, etc.)
   - Longitud general
   - Técnicas especiales utilizadas

2. **Textura y Acabado:**
   - Textura (liso, ondulado, rizado, etc.)
   - Volumen y movimiento
   - Productos o técnicas para lograr el acabado

3. **Estilo y Ocasión:**
   - Estilo general (moderno, clásico, casual, elegante)
   - Mejor ocasión para este look
   - Tipo de rostro que favorece

4. **Mantenimiento:**
   - Nivel de dificultad para mantenerlo
   - Frecuencia de corte recomendada

Sé específico, profesional y proporciona detalles útiles para que un cliente entienda completamente el estilo.`;

const DEFAULT_COLOR_PROMPT = `Eres un colorista experto en cabello. Analiza este tono/color de cabello y proporciona una descripción profesional que incluya:

1. **Tono Base y Matices:**
   - Color base principal
   - Matices secundarios (cálidos/fríos)
   - Nivel de claridad (1-10, donde 1 es negro y 10 es rubio muy claro)

2. **Técnica de Aplicación:**
   - Método usado (balayage, mechas, tinte global, ombré, etc.)
   - Distribución del color
   - Transiciones y degradados

3. **Profundidad y Dimensión:**
   - Reflejos y luces
   - Contrastes y profundidad
   - Brillo y luminosidad

4. **Mantenimiento y Cuidados:**
   - Frecuencia de retoque recomendada
   - Productos especiales necesarios
   - Cuidados para mantener el color vibrante

Sé específico, usa terminología profesional pero comprensible, y proporciona información valiosa para el cliente.`;

(async () => {
    try {
        console.log('🎨 Actualizando prompts del sistema...\n');

        // Actualizar todas las configuraciones de org 1
        await sequelize.query(`
            UPDATE salon_configs 
            SET hairstyle_sys_prompt = ?,
                color_sys_prompt = ?
            WHERE organization_id = 1
        `, {
            replacements: [DEFAULT_HAIRSTYLE_PROMPT, DEFAULT_COLOR_PROMPT]
        });

        console.log('✅ Prompts actualizados exitosamente\n');

        // Verificar
        const [configs] = await sequelize.query(`
            SELECT id, hairstyle_sys_prompt, color_sys_prompt
            FROM salon_configs
            WHERE organization_id = 1
            LIMIT 1
        `);

        if (configs.length > 0) {
            console.log('📋 Verificación:');
            console.log(`  Hairstyle Prompt: ${configs[0].hairstyle_sys_prompt.substring(0, 80)}...`);
            console.log(`  Color Prompt: ${configs[0].color_sys_prompt.substring(0, 80)}...`);
        }

        console.log('\n✨ Los prompts ya están disponibles en el Admin Panel');
        console.log('   Ve a: http://localhost:3000/admin-mirror');
        console.log('   Sección: "Configuración de Prompts (Sistema)"\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();
