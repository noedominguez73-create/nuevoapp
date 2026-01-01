const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GamesCatalog = sequelize.define('GamesCatalog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    technical_key: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        comment: 'Clave técnica única, ej: gweled_match3'
    },
    public_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nombre público del juego'
    },
    description: {
        type: DataTypes.TEXT,
        comment: 'Descripción del juego'
    },
    default_config: {
        type: DataTypes.JSON,
        defaultValue: {},
        comment: 'Configuración por defecto: {cols: 8, rows: 8, colors: 7}'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'games_catalog',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['technical_key']
        },
        {
            fields: ['is_active']
        }
    ]
});

module.exports = { GamesCatalog };
