const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AIConfiguration = sequelize.define('AIConfiguration', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    function: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique function identifier (e.g., legal_advice, describe_clothing)'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    provider: {
        type: DataTypes.ENUM('gemini', 'openai', 'replicate', 'anthropic'),
        allowNull: false,
        defaultValue: 'gemini'
    },
    model: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Model name (e.g., gemini-2.0-flash-exp, gpt-4)'
    },
    hasVision: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this AI can process images'
    },
    systemPrompt: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Base system prompt for this AI'
    },
    parameters: {
        type: DataTypes.JSON,
        defaultValue: {},
        comment: 'Model parameters like temperature, maxTokens, topP, etc.'
    },
    usageStats: {
        type: DataTypes.JSON,
        defaultValue: {
            totalTokens: 0,
            totalImages: 0,
            totalCost: 0,
            lastUsed: null
        },
        comment: 'Usage statistics'
    },
    organization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Organization ID for multi-tenant support'
    }
}, {
    tableName: 'ai_configurations',
    timestamps: true,
    indexes: [
        { fields: ['function'] },
        { fields: ['enabled'] },
        { fields: ['organization_id'] }
    ]
});

module.exports = AIConfiguration;
