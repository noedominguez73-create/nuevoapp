/**
 * AI Services - Multi-Tenant AI Provider System
 * 
 * Exports:
 * - AIService: Main factory for creating AI providers per organization
 * - AIProvider: Base interface class
 * - StudioProvider: Google AI Studio implementation
 * - VertexProvider: Vertex AI implementation
 */

const AIService = require('./AIService');
const AIProvider = require('./interfaces/AIProvider');
const StudioProvider = require('./providers/StudioProvider');
const VertexProvider = require('./providers/VertexProvider');

module.exports = {
    AIService,
    AIProvider,
    StudioProvider,
    VertexProvider
};
