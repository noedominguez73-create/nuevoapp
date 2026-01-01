const { sequelize } = require('../src/config/database');
const AIConfiguration = require('../src/models/AIConfiguration');

async function seedAIConfigurations() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database');

        await AIConfiguration.sync({ alter: true });
        console.log('✅ AIConfiguration table synced');

        const existingCount = await AIConfiguration.count();
        if (existingCount > 0) {
            console.log(`⚠️  ${existingCount} AI configurations already exist. Skipping seed.`);
            return;
        }

        const aiConfigs = [
            {
                id: 'legal-advice',
                name: 'IA Legal',
                function: 'legal_advice',
                description: 'Proporciona consejos legales basados en derecho mexicano',
                enabled: true,
                provider: 'gemini',
                model: 'gemini-2.0-flash-exp',
                hasVision: true,
                systemPrompt: 'Eres un asesor legal experto en derecho laboral y comercial mexicano. Proporciona consejos claros, precisos y basados en la legislación vigente. Siempre menciona que tus respuestas son orientativas y no sustituyen la consulta con un abogado profesional.',
                parameters: {
                    temperature: 0.3,
                    maxTokens: 2048,
                    topP: 0.9
                },
                organization_id: 1
            },
            {
                id: 'describe-clothing',
                name: 'IA Descripción Ropa',
                function: 'describe_clothing',
                description: 'Analiza imágenes de prendas y genera descripciones detalladas',
                enabled: true,
                provider: 'gemini',
                model: 'gemini-2.0-flash-exp',
                hasVision: true,
                systemPrompt: 'Analiza la imagen de la prenda de ropa y proporciona una descripción detallada incluyendo: tipo de prenda, color, estilo, material aparente, ocasión de uso recomendada, y combinaciones sugeridas.',
                parameters: {
                    temperature: 0.7,
                    maxTokens: 1024,
                    topP: 0.95
                },
                organization_id: 1
            },
            {
                id: 'outfit-generator',
                name: 'IA Generador Outfit',
                function: 'outfit_generator',
                description: 'Genera imágenes de personas vistiendo prendas específicas',
                enabled: true,
                provider: 'replicate',
                model: 'stable-diffusion-xl',
                hasVision: false,
                systemPrompt: 'Generate a high-quality fashion image of a person wearing {clothing_description}. Style: professional fashion photography, good lighting, neutral background.',
                parameters: {
                    width: 768,
                    height: 1024,
                    num_inference_steps: 30
                },
                organization_id: 1
            },
            {
                id: 'style-advisor',
                name: 'IA Asesora Estilo',
                function: 'style_advisor',
                description: 'Chat personalizado de asesoría de imagen y estilo',
                enabled: true,
                provider: 'gemini',
                model: 'gemini-1.5-pro',
                hasVision: false,
                systemPrompt: 'Eres una asesora de imagen profesional especializada en moda latinoamericana. Ayudas a las personas a encontrar su estilo personal, considerando su tipo de cuerpo, tono de piel, y estilo de vida. Sé empática, específica y ofrece sugerencias prácticas y accesibles.',
                parameters: {
                    temperature: 0.8,
                    maxTokens: 2048,
                    topP: 0.95
                },
                organization_id: 1
            },
            {
                id: 'facial-analysis',
                name: 'IA Análisis Facial',
                function: 'facial_analysis',
                description: 'Analiza características faciales para recomendaciones de estilo',
                enabled: true,
                provider: 'gemini',
                model: 'gemini-2.0-flash-exp',
                hasVision: true,
                systemPrompt: 'Analiza la imagen facial y determina: forma de rostro, tono de piel, características destacadas. Proporciona recomendaciones de peinados, accesorios y colores que complementen estas características.',
                parameters: {
                    temperature: 0.5,
                    maxTokens: 1536,
                    topP: 0.9
                },
                organization_id: 1
            },
            {
                id: 'translator',
                name: 'IA Traductor',
                function: 'translator',
                description: 'Traduce textos entre diferentes idiomas',
                enabled: true,
                provider: 'gemini',
                model: 'gemini-2.0-flash',
                hasVision: false,
                systemPrompt: 'Traduce el siguiente texto al idioma solicitado manteniendo el contexto y el tono original. Si el texto contiene términos de moda o estilismo, usa la traducción más apropiada para el contexto.',
                parameters: {
                    temperature: 0.3,
                    maxTokens: 2048,
                    topP: 0.9
                },
                organization_id: 1
            },
            {
                id: 'color-match',
                name: 'IA Color Match',
                function: 'color_match',
                description: 'Analiza combinaciones de colores en prendas e imágenes',
                enabled: true,
                provider: 'gemini',
                model: 'gemini-2.0-flash-exp',
                hasVision: true,
                systemPrompt: 'Analiza los colores en la imagen y sugiere combinaciones armoniosas. Considera teoría del color, estaciones del año (colorimetría), y tendencias actuales. Proporciona recomendaciones específicas de colores que complementen o contrasten adecuadamente.',
                parameters: {
                    temperature: 0.6,
                    maxTokens: 1024,
                    topP: 0.9
                },
                organization_id: 1
            },
            {
                id: 'text-summarizer',
                name: 'IA Resumen',
                function: 'text_summarizer',
                description: 'Genera resúmenes concisos de textos largos',
                enabled: false,
                provider: 'gemini',
                model: 'gemini-2.0-flash',
                hasVision: false,
                systemPrompt: 'Resume el siguiente texto de forma concisa y clara, manteniendo los puntos más importantes. El resumen debe ser fácil de leer y entender.',
                parameters: {
                    temperature: 0.4,
                    maxTokens: 1024,
                    topP: 0.9
                },
                organization_id: 1
            },
            {
                id: 'reserved-1',
                name: 'IA [Reservado]',
                function: 'reserved_1',
                description: 'Espacio reservado para futura implementación',
                enabled: false,
                provider: 'gemini',
                model: 'gemini-2.0-flash',
                hasVision: false,
                systemPrompt: '',
                parameters: {},
                organization_id: 1
            },
            {
                id: 'reserved-2',
                name: 'IA [Reservado]',
                function: 'reserved_2',
                description: 'Espacio reservado para futura implementación',
                enabled: false,
                provider: 'gemini',
                model: 'gemini-2.0-flash',
                hasVision: false,
                systemPrompt: '',
                parameters: {},
                organization_id: 1
            }
        ];

        await AIConfiguration.bulkCreate(aiConfigs);
        console.log('✅ Seeded 10 AI configurations successfully');

        const count = await AIConfiguration.count();
        console.log(`📊 Total AI configurations in database: ${count}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding AI configurations:', error);
        process.exit(1);
    }
}

seedAIConfigurations();
