const { Sequelize } = require('sequelize');
require('dotenv').config();

// ==========================================
// 🛡️ SOLID MYSQL CONFIGURATION (CommonJS)
// ==========================================

console.log("🔌 Initializing Database Connection (MySQL)...");
console.log("   Target Host:", process.env.DB_HOST || 'localhost');
console.log("   Target User:", process.env.DB_USER || 'u182581262_terminal');
console.log("   Target DB:  ", process.env.DB_NAME || 'u182581262_appnode');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'u182581262_appnode',
    process.env.DB_USER || 'u182581262_terminal',
    process.env.DB_PASS || 'WeK6#VY54+JU4Kn',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
        port: process.env.DB_PORT || 3306,
        dialectOptions: {
            ssl: {
                require: false,
                rejectUnauthorized: false
            },
            connectTimeout: 10000
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

module.exports = { sequelize };
