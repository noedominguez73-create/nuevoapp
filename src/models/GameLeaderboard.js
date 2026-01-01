const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GameLeaderboard = sequelize.define('GameLeaderboard', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    game_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    organization_id: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    final_score: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    game_mode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'normal, timed, endless'
    },
    duration_seconds: {
        type: DataTypes.INTEGER,
        comment: 'Duración de la partida'
    },
    achieved_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'game_leaderboards',
    timestamps: false,
    underscored: true,
    indexes: [
        {
            name: 'idx_ranking_global',
            fields: ['game_id', 'game_mode', ['final_score', 'DESC']]
        },
        {
            fields: ['user_id']
        },
        {
            fields: ['organization_id']
        }
    ]
});

module.exports = { GameLeaderboard };
