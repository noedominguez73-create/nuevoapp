const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TrainingLesson = sequelize.define('TrainingLesson', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    program_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    day_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Día 1-17'
    },
    lesson_title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    lesson_content: {
        type: DataTypes.TEXT,
        comment: 'Contenido completo de la lección'
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    },
    exercises: {
        type: DataTypes.JSON,
        comment: 'Lista de ejercicios específicos'
    },
    success_criteria: {
        type: DataTypes.JSON,
        comment: 'Criterios para completar la lección'
    },
    order_index: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'training_lessons',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['program_id', 'day_number']
        }
    ]
});

module.exports = { TrainingLesson };
