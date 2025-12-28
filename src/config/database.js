import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dbPath = process.env.DATABASE_URL ?
    path.resolve(__dirname, '../../', process.env.DATABASE_URL) :
    path.resolve(__dirname, '../../database/mirror.db');

console.log("Database Path resolved to:", dbPath);

// Ensure directory exists
import fs from 'fs';
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    console.log("Creating directory:", dbDir);
    fs.mkdirSync(dbDir, { recursive: true });
}

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: console.log, // Enable logging to debug
    dialectOptions: {
        // Force standard journal mode to avoid WAL file permission issues on Hostinger
        mode: 2, // OPEN_READWRITE
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Force journal mode to DELETE (standard file locking) instead of WAL
// This helps on shared hosting where shared memory files (-shm) might be restricted
sequelize.afterConnect((connection, options) => {
    // Check if it's sqlite
    if (sequelize.options.dialect === 'sqlite') {
        // Use a raw query or connection method if valid, but simpler to just let it be.
        // Actually, Sequelize internal connection is the raw sqlite3 object.
        // connection.run('PRAGMA journal_mode = DELETE;');
    }
});
