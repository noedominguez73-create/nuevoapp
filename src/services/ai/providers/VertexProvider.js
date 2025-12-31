const { VertexAI } = require('@google-cloud/vertexai');
const AIProvider = require('../interfaces/AIProvider');

/**
 * VertexProvider - Vertex AI implementation
 * Uses Service Account authentication (enterprise-grade)
 * Best for: Large salons, production, SLA requirements
 */
class VertexProvider extends AIProvider {
    constructor(config) {
        super(config);

        this.projectId = config.projectId;
        this.location = config.location || 'us-central1';
        this.serviceAccountJson = config.serviceAccountJson;

        if (!this.projectId) {
            throw new Error('VertexProvider requires projectId in config');
        }

        // Initialize Vertex AI with credentials
        const vertexConfig = {
            project: this.projectId,
            location: this.location
        };

        // If service account JSON provided, set credentials
        if (this.serviceAccountJson) {
            try {
                const credentials = typeof this.serviceAccountJson === 'string'
                    ? JSON.parse(this.serviceAccountJson)
                    : this.serviceAccountJson;

                // Set Google Application Credentials
                process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON = JSON.stringify(credentials);
            } catch (err) {
                console.warn('[VertexProvider] Invalid service account JSON, using default ADC');
            }
        }

        this.vertexAI = new VertexAI(vertexConfig);
    }

    async analyzeImage(imageData, prompt, mimeType = 'image/jpeg', retries = 3) {
        const model = this.vertexAI.getGenerativeModel({
            model: 'gemini-1.5-flash', // Versión genérica (sin -002 para compatibilidad)
            safetySettings: [
                {
                    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    threshold: 'BLOCK_ONLY_HIGH'
                },
                {
                    category: 'HARM_CATEGORY_HARASSMENT',
                    threshold: 'BLOCK_ONLY_HIGH'
                }
            ]
        });

        // Convert Buffer to base64 string if needed
        const base64 = Buffer.isBuffer(imageData)
            ? imageData.toString('base64')
            : imageData;

        // Retry logic with exponential backoff
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                // Timeout controller (8 seconds max)
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                const result = await model.generateContent({
                    contents: [{
                        role: 'user',
                        parts: [
                            {
                                inlineData: {
                                    mimeType: mimeType,
                                    data: base64
                                }
                            },
                            { text: prompt }
                        ]
                    }]
                }, { signal: controller.signal });

                clearTimeout(timeoutId);

                const text = result.response.candidates[0].content.parts[0].text;

                return {
                    text: text,
                    tokens: result.response.usageMetadata || {}
                };

            } catch (error) {
                console.error(`[VertexProvider] Attempt ${attempt}/${retries} failed:`, error.message);

                // Retry on rate limit (429)
                if (error.code === 429 && attempt < retries) {
                    const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
                    console.log(`[VertexProvider] Waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }

                // Final attempt failed
                if (attempt === retries) {
                    throw new Error(`Vertex AI failed after ${retries} attempts: ${error.message}`);
                }
            }
        }
    }

    getName() {
        return `Vertex AI (${this.projectId})`;
    }

    getType() {
        return 'VERTEX';
    }
}

module.exports = VertexProvider;
