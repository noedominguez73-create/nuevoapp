const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FinanceAccount = sequelize.define('FinanceAccount', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Dueño de esta cuenta'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Nombre de la cuenta bancaria'
    },
    type: {
        type: DataTypes.ENUM('cash', 'debit', 'savings', 'credit', 'other'),
        defaultValue: 'cash'
    },
    balance: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00,
        comment: 'Saldo actual'
    },
    color: {
        type: DataTypes.STRING(7),
        defaultValue: '#3B82F6',
        comment: 'Color para UI'
    }
}, {
    tableName: 'finance_accounts',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['user_id', 'type'] }
    ]
});

module.exports = FinanceAccount;
