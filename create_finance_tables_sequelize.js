/**
 * Script para crear tablas de finanzas usando Sequelize
 * Ejecutar: node create_finance_tables_sequelize.js
 */

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Conectar a la base de datos
const sequelize = new Sequelize(
    'u182581262_appnode',  // database name
    'root',                // username
    '1020304050',          // password
    {
        host: '127.0.0.1',
        dialect: 'mysql',
        logging: console.log
    }
);

async function createTables() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL exitosa');

        // Crear tablas financieras
        console.log('\n📊 Creando tablas de finanzas...\n');

        // 1. Finance Accounts
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS finance_accounts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                type ENUM('cash', 'debit', 'savings', 'credit', 'other') DEFAULT 'cash',
                balance DECIMAL(15, 2) DEFAULT 0.00,
                color VARCHAR(7) DEFAULT '#3B82F6',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Tabla finance_accounts creada');

        // 2. Finance Transactions
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS finance_transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                account_id INT NOT NULL,
                type ENUM('income', 'expense') NOT NULL,
                category VARCHAR(255),
                subcategory VARCHAR(255),
                description VARCHAR(500),
                amount DECIMAL(15, 2) NOT NULL,
                date DATE NOT NULL,
                document_base64 LONGTEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (account_id) REFERENCES finance_accounts(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_account_id (account_id),
                INDEX idx_date (date),
                INDEX idx_type (type)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Tabla finance_transactions creada');

        // 3. Finance Bills
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS finance_bills (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(255),
                subcategory VARCHAR(255),
                amount DECIMAL(15, 2) NOT NULL,
                paid_amount DECIMAL(15, 2) DEFAULT 0.00,
                due_date DATE,
                recurring BOOLEAN DEFAULT FALSE,
                frequency ENUM('weekly', 'monthly') DEFAULT 'monthly',
                is_paid BOOLEAN DEFAULT FALSE,
                notes TEXT,
                receipt_base64 LONGTEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_due_date (due_date),
                INDEX idx_is_paid (is_paid)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Tabla finance_bills creada');

        // 4. Finance Receivables
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS finance_receivables (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                client_name VARCHAR(255) NOT NULL,
                description VARCHAR(500),
                amount DECIMAL(15, 2) NOT NULL,
                paid_amount DECIMAL(15, 2) DEFAULT 0.00,
                due_date DATE,
                is_paid BOOLEAN DEFAULT FALSE,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_is_paid (is_paid)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Tabla finance_receivables creada');

        // 5. Finance Todos
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS finance_todos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                text VARCHAR(500) NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_completed (completed)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Tabla finance_todos creada');

        // 6. Finance Categories
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS finance_categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                icon VARCHAR(50) DEFAULT 'circle',
                color VARCHAR(7) DEFAULT '#6B7280',
                subcategories JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                UNIQUE KEY unique_user_category (user_id, name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Tabla finance_categories creada');

        console.log('\n✅ ¡TODAS LAS TABLAS CREADAS EXITOSAMENTE!');
        console.log('\n📋 Resumen:');
        console.log('   - finance_accounts (Cuentas bancarias)');
        console.log('   - finance_transactions (Ingresos/Gastos)');
        console.log('   - finance_bills (Facturas por pagar)');
        console.log('   - finance_receivables (Cuentas por cobrar)');
        console.log('   - finance_todos (Tareas)');
        console.log('   - finance_categories (Categorías)');
        console.log('\n🔒 Cada tabla tiene user_id para separación de datos');
        console.log('   → María solo ve SUS datos');
        console.log('   → Luisa solo ve SUS datos');
        console.log('   → Juan solo ve SUS datos\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

createTables();
