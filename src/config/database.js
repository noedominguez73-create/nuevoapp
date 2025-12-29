const { Sequelize } = require('sequelize');
require('dotenv').config();

// ==========================================
// 🛡️ SOLID MYSQL CONFIGURATION (CommonJS)
// ==========================================

// HOSTINGER FIX: Detect 'srv1691.hstgr.io' and force '127.0.0.1' to avoid IPv6 (::1) issues
let targetHost = process.env.DB_HOST || '127.0.0.1';
if (targetHost === 'srv1691.hstgr.io' || targetHost === 'localhost') {
    console.log("⚠️ Hostinger Detected: Forcing 127.0.0.1 to avoid IPv6 Access Denied");
    targetHost = '127.0.0.1';
}

console.log("🔌 Initializing Database Connection (MySQL)...");
console.log("   Target Host:", targetHost);
console.log("   Target User:", process.env.DB_USER || 'u182581262_terminal');
console.log("   Target DB:  ", process.env.DB_NAME || 'u182581262_appnode');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'u182581262_appnode',
    process.env.DB_USER || 'u182581262_terminal',
    process.env.DB_PASS || 'WeK6#VY54+JU4Kn',
    {
        host: targetHost,
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
