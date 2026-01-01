const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-char-secret-key-change-me!!';
const ALGORITHM = 'aes-256-cbc';

const APIKey = sequelize.define('APIKey', {
    provider: {
        type: DataTypes.ENUM('gemini', 'openai', 'replicate', 'anthropic'),
        primaryKey: true
    },
    encryptedKey: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Encrypted API key'
    },
    iv: {
        type: DataTypes.STRING(32),
        allowNull: false,
        comment: 'Initialization vector for decryption'
    },
    isValid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lastValidated: {
        type: DataTypes.DATE,
        allowNull: true
    },
    lastUsed: {
        type: DataTypes.DATE,
        allowNull: true
    },
    organization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: 'api_keys',
    timestamps: true,
    indexes: [
        { fields: ['organization_id'] }
    ]
});

// Helper methods
APIKey.encryptKey = function (plainKey) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(plainKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        encryptedKey: encrypted,
        iv: iv.toString('hex')
    };
};

APIKey.decryptKey = function (encryptedKey, ivHex) {
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

APIKey.prototype.getDecryptedKey = function () {
    return APIKey.decryptKey(this.encryptedKey, this.iv);
};

module.exports = APIKey;
