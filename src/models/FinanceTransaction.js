const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FinanceTransaction = sequelize.define('FinanceTransaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(255)
    },
    subcategory: {
        type: DataTypes.STRING(255)
    },
    description: {
        type: DataTypes.STRING(500)
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    document_base64: {
        type: DataTypes.TEXT('long'),
        comment: 'Comprobante fotográfico en Base64'
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'finance_transactions',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['account_id'] },
        { fields: ['date'] },
        { fields: ['type'] },
        { fields: ['user_id', 'date'] }
    ]
});

module.exports = { FinanceTransaction };
