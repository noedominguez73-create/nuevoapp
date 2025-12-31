/**
 * AIProvider - Abstract Base Class for AI Vision Providers
 * 
 * Implementation of Strategy Pattern for multi-provider support.
 * Each organization can use different providers (Studio, Vertex, etc.)
 */

class AIProvider {
    constructor(config) {
        if (this.constructor === AIProvider) {
            throw new Error("AIProvider is abstract - cannot instantiate directly");
        }
        this.config = config;
    }

    /**
     * Analyze image and generate description
     * @param {Buffer|string} imageData - Image as Buffer or base64 string
     * @param {string} prompt - System prompt for analysis
     * @param {string} mimeType - image/jpeg, image/png, etc.
     * @returns {Promise<{text: string, tokens: object}>}
     */
    async analyzeImage(imageData, prompt, mimeType) {
        throw new Error("analyzeImage() must be implemented by subclass");
    }

    /**
     * Get provider name for logging
     * @returns {string}
     */
    getName() {
        throw new Error("getName() must be implemented by subclass");
    }

    /**
     * Get provider type identifier
     * @returns {string} 'STUDIO' | 'VERTEX'
     */
    getType() {
        throw new Error("getType() must be implemented by subclass");
    }
}

module.exports = AIProvider;
