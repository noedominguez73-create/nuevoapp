const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FinanceBill = sequelize.define('FinanceBill', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(255)
    },
    subcategory: {
        type: DataTypes.STRING(255)
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    paid_amount: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00
    },
    due_date: {
        type: DataTypes.DATEONLY
    },
    recurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    frequency: {
        type: DataTypes.ENUM('weekly', 'monthly'),
        defaultValue: 'monthly'
    },
    is_paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    notes: {
        type: DataTypes.TEXT
    },
    receipt_base64: {
        type: DataTypes.TEXT('long'),
        comment: 'Recibo/factura en Base64'
    }
}, {
    tableName: 'finance_bills',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['due_date'] },
        { fields: ['is_paid'] },
        { fields: ['user_id', 'is_paid'] }
    ]
});

module.exports = { FinanceBill };
