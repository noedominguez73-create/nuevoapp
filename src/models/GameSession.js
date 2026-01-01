const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GameSession = sequelize.define('GameSession', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK a users'
    },
    game_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK a games_catalog'
    },
    organization_id: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'Multi-tenancy'
    },
    current_level: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    current_score: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
    },
    moves_remaining: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'NULL si es modo infinito'
    },
    time_seconds: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Tiempo acumulado de juego'
    },
    board_state: {
        type: DataTypes.JSON,
        comment: 'Matriz 8x8 serializada del tablero actual'
    },
    game_mode: {
        type: DataTypes.ENUM('normal', 'timed', 'endless'),
        defaultValue: 'normal'
    },
    status: {
        type: DataTypes.ENUM('active', 'game_over', 'abandoned'),
        defaultValue: 'active'
    }
}, {
    tableName: 'game_sessions',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['user_id', 'game_id', 'status']
        },
        {
            fields: ['organization_id']
        }
    ]
});

module.exports = { GameSession };
