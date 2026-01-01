const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserTrainingProgress = sequelize.define('UserTrainingProgress', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    program_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    organization_id: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    current_day: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    lessons_completed: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: 'Array de IDs de lecciones completadas'
    },
    total_practice_minutes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    average_score: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        comment: 'Promedio de evaluaciones'
    },
    started_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    last_activity_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('in_progress', 'completed', 'abandoned'),
        defaultValue: 'in_progress'
    }
}, {
    tableName: 'user_training_progress',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['user_id', 'program_id']
        },
        {
            fields: ['organization_id']
        }
    ]
});

module.exports = { UserTrainingProgress };
