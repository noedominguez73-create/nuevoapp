const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// PREGUNTA AL EXPERTO - 4 modelos

const Expert = sequelize.define('Expert', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, comment: 'Usuario que es experto' },
    organization_id: { type: DataTypes.INTEGER, defaultValue: 1 },
    specialty: {
        type: DataTypes.STRING(100),
        comment: 'hair_styling, makeup, nutrition, etc'
    },
    bio: { type: DataTypes.TEXT },
    certifications: { type: DataTypes.JSON, defaultValue: [] },
    years_experience: { type: DataTypes.INTEGER },
    rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
    total_consultations: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
    hourly_rate: { type: DataTypes.DECIMAL(10, 2) }
}, {
    tableName: 'experts',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['specialty'] },
        { fields: ['is_available'] }
    ]
});

const Consultation = sequelize.define('Consultation', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    requester_user_id: { type: DataTypes.INTEGER, allowNull: false },
    expert_id: { type: DataTypes.INTEGER, allowNull: false },
    organization_id: { type: DataTypes.INTEGER, defaultValue: 1 },
    consultation_type: {
        type: DataTypes.ENUM('chat', 'video', 'async'),
        defaultValue: 'chat'
    },
    subject: { type: DataTypes.STRING(200) },
    description: { type: DataTypes.TEXT },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    scheduled_at: { type: DataTypes.DATE },
    started_at: { type: DataTypes.DATE },
    completed_at: { type: DataTypes.DATE },
    duration_minutes: { type: DataTypes.INTEGER },
    price: { type: DataTypes.DECIMAL(10, 2) }
}, {
    tableName: 'consultations',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['requester_user_id'] },
        { fields: ['expert_id'] },
        { fields: ['status'] }
    ]
});

const ConsultationMessage = sequelize.define('ConsultationMessage', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    consultation_id: { type: DataTypes.BIGINT, allowNull: false },
    sender_user_id: { type: DataTypes.INTEGER, allowNull: false },
    message_type: {
        type: DataTypes.ENUM('text', 'image', 'video', 'audio'),
        defaultValue: 'text'
    },
    content: { type: DataTypes.TEXT },
    media_url: { type: DataTypes.STRING(500) },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'consultation_messages',
    timestamps: false,
    underscored: true
});

const ExpertRating = sequelize.define('ExpertRating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    consultation_id: { type: DataTypes.BIGINT, allowNull: false },
    expert_id: { type: DataTypes.INTEGER, allowNull: false },
    rater_user_id: { type: DataTypes.INTEGER, allowNull: false },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    comment: { type: DataTypes.TEXT }
}, {
    tableName: 'expert_ratings',
    timestamps: true,
    underscored: true
});

module.exports = {
    Expert,
    Consultation,
    ConsultationMessage,
    ExpertRating
};
