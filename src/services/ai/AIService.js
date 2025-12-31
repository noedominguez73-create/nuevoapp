const StudioProvider = require('./providers/StudioProvider');
const VertexProvider = require('./providers/VertexProvider');
const { ApiConfig } = require('../../models/index.js');

/**
 * AIService - Factory for AI Providers (Multi-Tenant)
 * 
 * Each organization can have different AI provider configuration.
 * Automatically selects and initializes the correct provider based on
 * database configuration for the given organization.
 */
class AIService {
    constructor(organizationId, section = 'peinado') {
        this.organizationId = organizationId;
        this.section = section;
        this.provider = null;
    }

    /**
     * Load provider configuration from database
     * @private
     */
    async _loadProvider() {
        // Query database for this organization's AI config
        const config = await ApiConfig.findOne({
            where: {
                organization_id: this.organizationId,
                section: this.section,
                is_active: true
            }
        });

        if (!config) {
            throw new Error(
                `No active AI config found for organization ${this.organizationId}, section "${this.section}"`
            );
        }

        console.log(
            `🤖 [Org ${this.organizationId}] Loading ${config.provider_type || 'STUDIO'} provider...`
        );

        // Factory: Create provider based on provider_type
        switch (config.provider_type) {
            case 'VERTEX':
                return new VertexProvider({
                    projectId: config.gcp_project_id,
                    location: config.gcp_location || 'us-central1',
                    serviceAccountJson: config.gcp_service_account_json
                });

            case 'STUDIO':
            default:
                return new StudioProvider({
                    apiKey: config.api_key
                });
        }
    }

    /**
     * Analyze image using configured provider
     * @param {Buffer|string} imageData
     * @param {string} prompt
     * @param {string} mimeType
     * @returns {Promise<{text: string, tokens: object}>}
     */
    async analyzeImage(imageData, prompt, mimeType) {
        // Lazy load provider on first use
        if (!this.provider) {
            this.provider = await this._loadProvider();
            console.log(
                `✅ [Org ${this.organizationId}] Using: ${this.provider.getName()}`
            );
        }

        return this.provider.analyzeImage(imageData, prompt, mimeType);
    }

    /**
     * Get provider name for logging
     * @returns {Promise<string>}
     */
    async getProviderName() {
        if (!this.provider) {
            this.provider = await this._loadProvider();
        }
        return this.provider.getName();
    }

    /**
     * Get provider type
     * @returns {Promise<string>}
     */
    async getProviderType() {
        if (!this.provider) {
            this.provider = await this._loadProvider();
        }
        return this.provider.getType();
    }
}

module.exports = AIService;
