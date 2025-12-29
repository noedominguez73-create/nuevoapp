const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');

const ApiConfig = sequelize.define('ApiConfig', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    api_name: {
        type: DataTypes.STRING(100),
        unique: false  // Changed from unique to allow multiple keys
    },
    provider: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'google'
    },
    section: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'peinado'
    },
    alias: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    api_key: DataTypes.TEXT,
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    settings: DataTypes.TEXT
}, {
    tableName: 'api_configs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = { ApiConfig };
