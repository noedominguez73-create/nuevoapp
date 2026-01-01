const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// AUDIOLIBROS - 4 modelos

const Audiobook = sequelize.define('Audiobook', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    author: { type: DataTypes.STRING(150) },
    narrator: { type: DataTypes.STRING(150) },
    description: { type: DataTypes.TEXT },
    category: {
        type: DataTypes.ENUM('business', 'self_help', 'fiction', 'biography', 'other'),
        defaultValue: 'other'
    },
    total_duration_minutes: { type: DataTypes.INTEGER },
    cover_image_url: { type: DataTypes.STRING(500) },
    audio_url: { type: DataTypes.STRING(500) },
    file_size_mb: { type: DataTypes.DECIMAL(10, 2) },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_premium: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: 'audiobooks',
    timestamps: true,
    underscored: true
});

const AudiobookChapter = sequelize.define('AudiobookChapter', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    audiobook_id: { type: DataTypes.INTEGER, allowNull: false },
    chapter_number: { type: DataTypes.INTEGER, allowNull: false },
    chapter_title: { type: DataTypes.STRING(200) },
    audio_url: { type: DataTypes.STRING(500) },
    duration_seconds: { type: DataTypes.INTEGER },
    start_time_seconds: { type: DataTypes.INTEGER, comment: 'Timestamp en audio completo' }
}, {
    tableName: 'audiobook_chapters',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['audiobook_id', 'chapter_number'] }]
});

const UserAudiobookProgress = sequelize.define('UserAudiobookProgress', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    audiobook_id: { type: DataTypes.INTEGER, allowNull: false },
    organization_id: { type: DataTypes.INTEGER, defaultValue: 1 },
    current_chapter_id: { type: DataTypes.INTEGER },
    current_position_seconds: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_listened_seconds: { type: DataTypes.INTEGER, defaultValue: 0 },
    playback_speed: { type: DataTypes.DECIMAL(2, 1), defaultValue: 1.0 },
    preferred_voice: { type: DataTypes.STRING(50) },
    is_favorite: { type: DataTypes.BOOLEAN, defaultValue: false },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    last_listened_at: { type: DataTypes.DATE }
}, {
    tableName: 'user_audiobook_progress',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['user_id', 'audiobook_id'] }]
});

const AudiobookBookmark = sequelize.define('AudiobookBookmark', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    audiobook_id: { type: DataTypes.INTEGER, allowNull: false },
    chapter_id: { type: DataTypes.INTEGER },
    position_seconds: { type: DataTypes.INTEGER, allowNull: false },
    note: { type: DataTypes.TEXT }
}, {
    tableName: 'audiobook_bookmarks',
    timestamps: true,
    underscored: true
});

module.exports = {
    Audiobook,
    AudiobookChapter,
    UserAudiobookProgress,
    AudiobookBookmark
};
