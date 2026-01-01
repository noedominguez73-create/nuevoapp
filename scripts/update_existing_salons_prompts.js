const { sequelize } = require('../src/config/database');
const { SalonConfig } = require('../src/models/SalonConfig');

// Prompts maestros - copiados directamente para evitar problemas de import
const MASTER_PROMPTS = {
    hairstyle_sys_prompt: `Analiza el peinado de la persona en la imagen prestando atención a:
- Tipo de corte (corto, medio, largo, rapado, etc.)
- Largo del cabello (por encima de hombros, hasta hombros, largo, extra largo)
- Textura y estilo (lacio, ondulado, rizado, afro, trenzado)
- Características especiales (flequillo, capas, degradado, undercut, etc.)
- Estado general (bien cuidado, necesita recorte, saludable, dañado)

Describe de manera profesional y detallada para que pueda usarse como referencia para transformaciones.`,

    color_sys_prompt: `Analiza el color del cabello en la imagen identificando:
- Tono base (negro, castaño oscuro, castaño, castaño claro, rubio oscuro, rubio, platino, pelirrojo, etc.)
- Reflejos o mechas (si tiene, qué tonos)
- Nivel de saturación (natural, vibrante, apagado, decolorado)
- Distribución del color (uniforme, con raíces, degradado, balayage, ombré)
- Recomendaciones de colores complementarios según tono de piel

Proporciona información útil para sugerir cambios de color que favorezcan a la persona.`,

    look_sys_prompt_1: `Eres un experto en análisis facial y asesoría de imagen. Analiza la forma del rostro de la persona en la imagen:

FORMA DEL ROSTRO:
- Identifica si es: ovalado, redondo, cuadrado, rectangular, corazón, diamante, triangular
- Analiza proporciones: frente, pómulos, línea de mandíbula
- Características destacadas: mentón, maxilar, pómulos

CARACTERÍSTICAS FACIALES:
- Estructura ósea prominente o suave
- Balance y simetría
- Rasgos distintivos

RECOMENDACIONES:
- Estilos de peinado que favorezcan esta forma de rostro
- Largos ideales
- Volúmenes recomendados (más en la coronilla, a los lados, etc.)
- Flequillos o mechones que equilibren las proporciones

Sé específico y profesional.`,

    look_sys_prompt_2: `Eres un estilista profesional especializado en transformación de peinados mediante IA generativa.

INSTRUCCIONES:
- Transforma el peinado de la persona según el estilo seleccionado por el usuario
- Mantén EXACTAMENTE las características faciales originales (ojos, nariz, boca, forma de rostro)
- Preserva el tono de piel, edad aparente y expresión facial
- Aplica el nuevo peinado de manera REALISTA Y NATURAL
- Respeta las luces y sombras del rostro
- Asegúrate de que el cabello se vea profesional, bien cuidado y acorde al estilo solicitado

ESTILOS DISPONIBLES:
{{PEINADOS_DISPONIBLES}}

El peinado debe verse como si fuera una foto real tomada en un salón profesional, NO como una edición digital obvia.`,

    look_sys_prompt_3: `Eres un colorista profesional especializado en transformación de color de cabello mediante IA generativa.

INSTRUCCIONES:
- Aplica el color de cabello seleccionado de manera REALISTA y PROFESIONAL
- Mantén EXACTAMENTE las características faciales y el peinado original
- El color debe verse natural, con:
  * Reflejos y matices apropiados
  * Luces y sombras que sigan la textura del cabello
  * Tonos dimensionales (no plano/uniforme)
  * Brillo natural del cabello sano
- Respeta la línea de nacimiento del cabello
- Considera los tonos de piel de la persona para que el color la favorezca

COLORES DISPONIBLES:
{{COLORES_DISPONIBLES}}

El resultado debe verse como una coloración profesional real, con la calidad de un salón de alto nivel.`,

    look_sys_prompt_4: `Eres un experto en transformación completa de imagen mediante IA generativa.

TAREA: Combina el peinado Y el color solicitados en UNA SOLA transformación armoniosa.

PRIORIDADES:
1. Mantener las características faciales EXACTAS de la persona (ojos, nariz, boca, estructura ósea)
2. Aplicar el peinado seleccionado: {{PEINADO_SELECCIONADO}}
3. Aplicar el color seleccionado: {{COLOR_SELECCIONADO}}
4. Crear una combinación armoniosa y profesional

REQUISITOS DE CALIDAD:
- El resultado debe verse como una foto REAL de la persona después de visitar un salón de belleza profesional
- NO debe verse como una edición digital obvia
- El cabello debe tener textura, volumen y movimiento natural
- Los colores deben tener dimensión (luces, sombras, reflejos)
- La iluminación debe ser coherente en toda la imagen
- El fondo debe mantenerse similar al original (o ligeramente desenfocado)

RESULTADO ESPERADO: Una transformación natural, realista y favorecedora que combine perfectamente peinado y color.`
};

async function updateExistingSalons() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database\n');

        const salons = await SalonConfig.findAll();

        console.log(`📊 Found ${salons.length} salon(s) to update\n`);

        for (const salon of salons) {
            console.log(`Updating Salon ID: ${salon.id} (User ID: ${salon.user_id})`);

            await salon.update({
                ...MASTER_PROMPTS
            });

            console.log(`✅ Updated successfully\n`);
        }

        console.log(`\n🎉 All ${salons.length} salon(s) updated with master prompts!`);
        console.log('\n📋 Prompts added:');
        console.log('- hairstyle_sys_prompt');
        console.log('- color_sys_prompt');
        console.log('- look_sys_prompt_1 (P CARA)');
        console.log('- look_sys_prompt_2 (P PEINADOS)');
        console.log('- look_sys_prompt_3 (P COLORES)');
        console.log('- look_sys_prompt_4 (COMBINACIÓN)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateExistingSalons();
