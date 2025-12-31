require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

async function testStudioVision() {
    try {
        console.log('\n🧪 ========================================');
        console.log('   PRUEBA GOOGLE AI STUDIO + VISION');
        console.log('========================================\n');

        // Get API Key from env
        const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyBR-HDUHl9zLUOHuUTsHVIU_aw2QBxvhnA';
        console.log('🔑 API Key:', apiKey.substring(0, 15) + '...');

        const genAI = new GoogleGenerativeAI(apiKey);

        // Try different vision models
        const modelsToTest = [
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-pro-vision'
        ];

        // Find a test image
        const uploadsDir = path.join(__dirname, 'app/static/uploads/items');
        const files = fs.readdirSync(uploadsDir);
        const imageFile = files.find(f => f.match(/\.(jpg|jpeg|png|webp)$/i));

        if (!imageFile) {
            console.log('❌ No hay imágenes de prueba en uploads/items/');
            process.exit(1);
        }

        const imagePath = path.join(uploadsDir, imageFile);
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        console.log('📸 Imagen de prueba:', imageFile);
        console.log('📦 Tamaño:', imageBuffer.length, 'bytes\n');

        // Test each model
        for (const modelName of modelsToTest) {
            console.log('─'.repeat(60));
            console.log(`🤖 Probando modelo: ${modelName}`);
            console.log('─'.repeat(60));

            try {
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = "Describe this hairstyle in one sentence";

                const result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: base64Image
                        }
                    }
                ]);

                const text = result.response.text();

                console.log('✅ ÉXITO con', modelName);
                console.log('📝 Respuesta:', text.substring(0, 100) + '...');
                console.log('');

                // If we found a working model, stop
                console.log(`\n🎯 MODELO FUNCIONAL ENCONTRADO: ${modelName}`);
                console.log('✅ Google AI Studio con Vision está funcionando correctamente\n');
                process.exit(0);

            } catch (error) {
                console.log('❌ Falló:', error.message);
                console.log('');
            }
        }

        console.log('\n❌ Ningún modelo de vision funcionó');
        console.log('💡 Posible causa: La API Key no tiene acceso a modelos vision');
        console.log('   Solución: Verificar permisos en Google AI Studio\n');
        process.exit(1);

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        process.exit(1);
    }
}

testStudioVision();
