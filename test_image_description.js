// Test directo de generación de descripción de imagen
const { generateImageDescription } = require('./src/services/geminiService');
const fs = require('fs');
const path = require('path');

(async () => {
    try {
        console.log('\n🧪 === TEST DE GENERACIÓN DE PROMPT ===\n');

        // Buscar una imagen de prueba en uploads
        const uploadsDir = path.join(__dirname, 'app/static/uploads/items');

        if (!fs.existsSync(uploadsDir)) {
            console.log('❌ No existe carpeta uploads/items');
            console.log('   Creando carpeta de prueba...');
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log('   Por favor, coloca una imagen de prueba en: uploads/items/test.jpg');
            process.exit(1);
        }

        const files = fs.readdirSync(uploadsDir);
        const imageFile = files.find(f => f.match(/\.(jpg|jpeg|png|webp)$/i));

        if (!imageFile) {
            console.log('❌ No se encontraron imágenes en uploads/items/');
            console.log('   Coloca una imagen de prueba ahí y vuelve a ejecutar');
            process.exit(1);
        }

        const imagePath = path.join(uploadsDir, imageFile);
        console.log('✅ Imagen encontrada:', imageFile);
        console.log('📂 Ruta:', imagePath);

        // Leer imagen
        const imageBuffer = fs.readFileSync(imagePath);
        console.log('📦 Tamaño del buffer:', imageBuffer.length, 'bytes');

        // Determinar MIME type
        const ext = path.extname(imageFile).toLowerCase();
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp'
        };
        const mimeType = mimeTypes[ext] || 'image/jpeg';
        console.log('🎨 MIME type:', mimeType);

        // LLAMAR A GEMINI
        console.log('\n🤖 Llamando a generateImageDescription...');
        console.log('   Modelo: gemini-1.5-flash');
        console.log('   Section: peinado');
        console.log('   Prompt: "Describe this hairstyle in detail..."');
        console.log('\n⏳ Generando descripción (esto puede tardar 5-10 segundos)...\n');

        const sysPrompt = "Describe this hairstyle in detail suitable for an AI generator.";
        const result = await generateImageDescription(sysPrompt, imageBuffer, mimeType, 'peinado');

        console.log('\n✅ ¡ÉXITO! Descripción generada:\n');
        console.log('═'.repeat(60));
        console.log(result.text);
        console.log('═'.repeat(60));

        if (result.usageMetadata) {
            console.log('\n📊 Uso de tokens:');
            console.log('   Input:', result.usageMetadata.promptTokenCount || 'N/A');
            console.log('   Output:', result.usageMetadata.candidatesTokenCount || 'N/A');
            console.log('   Total:', result.usageMetadata.totalTokenCount || 'N/A');
        }

        console.log('\n✅ La generación de prompts SÍ funciona correctamente.');
        console.log('   El problema debe estar en otro lugar del flujo de subida.\n');

        process.exit(0);

    } catch (err) {
        console.error('\n❌ ERROR AL GENERAR DESCRIPCIÓN:\n');
        console.error('Mensaje:', err.message);
        console.error('\nStack:', err.stack);
        console.error('\n💡 POSIBLES CAUSAS:');
        console.error('   1. No hay API Key configurada para la sección "peinado"');
        console.error('   2. La API Key no es válida');
        console.error('   3. No tienes acceso al modelo gemini-1.5-flash');
        console.error('   4. Problema de red con Google AI API\n');
        process.exit(1);
    }
})();
