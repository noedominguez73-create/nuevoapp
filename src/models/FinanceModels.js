const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FinanceReceivable = sequelize.define('FinanceReceivable', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    client_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(500)
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
    is_paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'finance_receivables',
    timestamps: true,
    underscored: true
});

const FinanceTodo = sequelize.define('FinanceTodo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'finance_todos',
    timestamps: true,
    underscored: true
});

const FinanceCategory = sequelize.define('FinanceCategory', {
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
    icon: {
        type: DataTypes.STRING(50),
        defaultValue: 'circle'
    },
    color: {
        type: DataTypes.STRING(7),
        defaultValue: '#6B7280'
    },
    subcategories: {
        type: DataTypes.JSON,
        comment: 'Array de subcategorías'
    }
}, {
    tableName: 'finance_categories',
    timestamps: true,
    underscored: true
});

module.exports = { FinanceReceivable, FinanceTodo, FinanceCategory };
