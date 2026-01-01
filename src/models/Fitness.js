const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// MIRROR FITNESS - 5 modelos

const FitnessProgram = sequelize.define('FitnessProgram', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    program_key: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    program_name: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT },
    total_days: { type: DataTypes.INTEGER, defaultValue: 5 },
    difficulty_level: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        defaultValue: 'beginner'
    },
    target_area: { type: DataTypes.STRING(50), comment: 'full_body, legs, upper_body' },
    equipment_needed: { type: DataTypes.JSON, defaultValue: [] }
}, {
    tableName: 'fitness_programs',
    timestamps: true,
    underscored: true
});

const FitnessWorkout = sequelize.define('FitnessWorkout', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    program_id: { type: DataTypes.INTEGER, allowNull: false },
    day_number: { type: DataTypes.INTEGER, allowNull: false },
    workout_name: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT },
    estimated_duration_minutes: { type: DataTypes.INTEGER },
    workout_config: { type: DataTypes.JSON, comment: 'Superseries, ejercicios, reps' }
}, {
    tableName: 'fitness_workouts',
    timestamps: true,
    underscored: true
});

const FitnessExercise = sequelize.define('FitnessExercise', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    exercise_key: { type: DataTypes.STRING(50), unique: true },
    exercise_name: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT },
    muscle_groups: { type: DataTypes.JSON, defaultValue: [] },
    difficulty_level: { type: DataTypes.ENUM('beginner', 'intermediate', 'advanced') },
    demo_video_url: { type: DataTypes.STRING(500) },
    key_points: { type: DataTypes.JSON, comment: 'Puntos reflectantes necesarios' },
    form_validation_rules: { type: DataTypes.JSON, comment: 'Reglas para IA' }
}, {
    tableName: 'fitness_exercises',
    timestamps: true,
    underscored: true
});

const UserFitnessProgress = sequelize.define('UserFitnessProgress', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    program_id: { type: DataTypes.INTEGER, allowNull: false },
    organization_id: { type: DataTypes.INTEGER, defaultValue: 1 },
    current_day: { type: DataTypes.INTEGER, defaultValue: 1 },
    workouts_completed: { type: DataTypes.JSON, defaultValue: [] },
    total_workouts: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_exercise_minutes: { type: DataTypes.INTEGER, defaultValue: 0 },
    average_form_score: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    started_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    last_workout_at: { type: DataTypes.DATE },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'paused'),
        defaultValue: 'active'
    }
}, {
    tableName: 'user_fitness_progress',
    timestamps: true,
    underscored: true
});

const FitnessSessionLog = sequelize.define('FitnessSessionLog', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    workout_id: { type: DataTypes.INTEGER },
    exercise_id: { type: DataTypes.INTEGER, allowNull: false },
    organization_id: { type: DataTypes.INTEGER, defaultValue: 1 },
    reps_completed: { type: DataTypes.INTEGER },
    sets_completed: { type: DataTypes.INTEGER },
    form_score: { type: DataTypes.INTEGER, comment: '0-100' },
    ai_feedback: { type: DataTypes.JSON, comment: 'Correcciones de postura' },
    video_recording_url: { type: DataTypes.STRING(500) },
    duration_seconds: { type: DataTypes.INTEGER }
}, {
    tableName: 'fitness_session_logs',
    timestamps: true,
    underscored: true
});

module.exports = {
    FitnessProgram,
    FitnessWorkout,
    FitnessExercise,
    UserFitnessProgress,
    FitnessSessionLog
};
