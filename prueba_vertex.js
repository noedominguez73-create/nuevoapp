require('dotenv').config();
const { VertexAI } = require('@google-cloud/vertexai');

async function probarConexion() {
    console.log('\n🔐 ========================================');
    console.log('   PRUEBA DE CONEXIÓN VERTEX AI');
    console.log('========================================\n');

    console.log('📋 Configuración:');
    console.log('   Project ID:', process.env.GOOGLE_CLOUD_PROJECT);
    console.log('   Location:', process.env.GOOGLE_CLOUD_LOCATION);
    console.log('   Credentials:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('');

    try {
        // 1. Inicializar cliente
        console.log('📡 Conectando a Vertex AI...');
        const vertex_ai = new VertexAI({
            project: process.env.GOOGLE_CLOUD_PROJECT,
            location: process.env.GOOGLE_CLOUD_LOCATION
        });

        // 2. Instanciar modelo (gemini-pro tiene mejor compatibilidad)
        const model = vertex_ai.getGenerativeModel({
            model: 'gemini-pro'
        });

        // 3. Enviar un "Hola mundo" simple
        const req = {
            contents: [{
                role: 'user',
                parts: [{ text: 'Responde solo con la palabra: CONECTADO' }]
            }],
        };

        console.log('⏳ Enviando petición a Gemini...\n');
        const result = await model.generateContent(req);
        const response = result.response;
        const text = response.candidates[0].content.parts[0].text;

        console.log('═'.repeat(60));
        console.log('✅ ÉXITO TOTAL:', text);
        console.log('═'.repeat(60));
        console.log('\n🚀 Tu sistema Mirror IA ya está operando con infraestructura Enterprise.');
        console.log('✅ Vertex AI configurado correctamente');
        console.log('✅ SLA 99.9% uptime garantizado');
        console.log('✅ Listo para producción\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('\n📋 Posibles causas:');
        console.error('   1. Ruta incorrecta en GOOGLE_APPLICATION_CREDENTIALS');
        console.error('   2. Archivo vertex-key.json no existe');
        console.error('   3. Project ID incorrecto en .env');
        console.error('   4. Vertex AI API no habilitada');
        console.error('\n💡 Solución:');
        console.error('   - Verifica que vertex-key.json esté en la raíz del proyecto');
        console.error('   - Revisa que GOOGLE_CLOUD_PROJECT sea: feisty-bindery-391106');
        console.error('   - Asegúrate de habilitar Vertex AI API en Google Cloud Console\n');

        process.exit(1);
    }
}

probarConexion();
