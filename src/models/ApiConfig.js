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
        unique: true
    },
    api_key: DataTypes.TEXT,
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    config_json: DataTypes.TEXT
}, {
    tableName: 'api_configs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = { ApiConfig };
