const { GoogleGenerativeAI } = require('@google/generative-ai');
const AIProvider = require('../interfaces/AIProvider');

/**
 * StudioProvider - Google AI Studio implementation
 * Uses API Key authentication (simple, free tier available)
 * Best for: Small salons, development, testing
 */
class StudioProvider extends AIProvider {
    constructor(config) {
        super(config);
        this.apiKey = config.apiKey;

        if (!this.apiKey) {
            throw new Error('StudioProvider requires apiKey in config');
        }

        this.genAI = new GoogleGenerativeAI(this.apiKey);
    }

    async analyzeImage(imageData, prompt, mimeType = 'image/jpeg') {
        try {
            // Use gemini-1.5-flash-latest for vision
            const model = this.genAI.getGenerativeModel({
                model: 'gemini-1.5-flash-latest'
            });

            // Convert Buffer to base64 string if needed
            const base64 = Buffer.isBuffer(imageData)
                ? imageData.toString('base64')
                : imageData;

            // Generate content with vision
            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64
                    }
                }
            ]);

            const response = result.response;

            return {
                text: response.text(),
                tokens: response.usageMetadata || {}
            };

        } catch (error) {
            console.error('[StudioProvider] Error:', error.message);
            throw new Error(`Studio AI failed: ${error.message}`);
        }
    }

    getName() {
        return 'Google AI Studio (API Key)';
    }

    getType() {
        return 'STUDIO';
    }
}

module.exports = StudioProvider;
