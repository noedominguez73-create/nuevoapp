const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * ==========================================
 * DATABASE CONFIGURATION - ENVIRONMENT VARIABLES
 * ==========================================
 * 
 * Variables requeridas en .env:
 * - DB_HOST (default: 127.0.0.1)
 * - DB_PORT (default: 3306)
 * - DB_NAME (REQUERIDO)
 * - DB_USER (REQUERIDO)
 * - DB_PASSWORD (REQUERIDO)
 */

console.log('🔌 Initializing Database Connection...');
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`   Database: ${process.env.DB_NAME || 'NOT_SET'}`);

// Validar variables críticas
if (!process.env.DB_NAME || !process.env.DB_USER) {
    console.error('❌ ERROR: Database credentials not configured!');
    console.error('   Please set DB_NAME and DB_USER in your .env file');
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Database credentials missing in production!');
    }
}

const sequelize = new Sequelize(
    process.env.DB_NAME || 'u182581262_appnode',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT) || 3306,
        dialect: 'mysql',

        logging: process.env.DB_LOGGING === 'true' ? console.log : false,

        pool: {
            max: parseInt(process.env.DB_POOL_MAX) || 10,
            min: parseInt(process.env.DB_POOL_MIN) || 0,
            acquire: 30000,
            idle: 10000
        },

        dialectOptions: {
            family: 4,              // Force IPv4
            connectTimeout: 10000,
            ssl: process.env.DB_SSL === 'true' ? {
                require: true,
                rejectUnauthorized: false
            } : false,
            charset: 'utf8mb4',
            timezone: '+00:00'
        },

        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        },

        retry: {
            max: 3,
            match: [
                /ETIMEDOUT/,
                /ECONNRESET/,
                /ENOTFOUND/,
                /ENETUNREACH/,
                /EAI_AGAIN/
            ]
        }
    }
);

console.log('✅ Sequelize instance created');
console.log(`   Host: ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 3306}`);
console.log(`   User: ${process.env.DB_USER || 'NOT_SET'}`);
console.log('   Password: ***PROTECTED***');

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        if (process.env.NODE_ENV === 'production') {
            console.error('   This is CRITICAL in production!');
        }
        return false;
    }
}

module.exports = { sequelize, testConnection };
