const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');

const MirrorUsage = sequelize.define('MirrorUsage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: DataTypes.INTEGER,
    item_id: DataTypes.INTEGER,
    action_type: DataTypes.STRING(50),
    tokens_used: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    tableName: 'mirror_usage',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = { MirrorUsage };
