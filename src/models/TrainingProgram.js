const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TrainingProgram = sequelize.define('TrainingProgram', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    program_key: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        comment: 'Clave técnica: leaders_speak_eloquence'
    },
    program_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        comment: 'Los Líderes Hablan con Elocuencia'
    },
    description: {
        type: DataTypes.TEXT
    },
    total_days: {
        type: DataTypes.INTEGER,
        defaultValue: 17,
        comment: 'Días totales del programa'
    },
    lesson_duration_minutes: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    },
    difficulty_level: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        defaultValue: 'beginner'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'training_programs',
    timestamps: true,
    underscored: true
});

module.exports = { TrainingProgram };
