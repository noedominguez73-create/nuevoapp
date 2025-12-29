const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');

const MirrorItem = sequelize.define('MirrorItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: DataTypes.STRING(50),
    name: DataTypes.STRING(100),
    description: DataTypes.TEXT,
    image_url: DataTypes.STRING(500),
    prompt: DataTypes.TEXT,
    color_code: DataTypes.STRING(20),
    order_index: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    price: DataTypes.DECIMAL(10, 2),
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'mirror_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = { MirrorItem };
