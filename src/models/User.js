const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING(100)
    },
    role: {
        type: DataTypes.STRING(20),
        defaultValue: 'user'
    },
    subscription_status: {
        type: DataTypes.STRING(20),
        defaultValue: 'inactive'
    },
    monthly_token_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    },
    current_month_tokens: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = { User };
