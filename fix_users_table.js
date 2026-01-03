const { sequelize } = require('./src/config/database.js');

async function fixUsersTable() {
    try {
        console.log('🔧 Verificando tabla users...');

        // Crear/actualizar tabla users con la estructura correcta
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(100),
                role VARCHAR(20) DEFAULT 'user',
                subscription_status VARCHAR(20) DEFAULT 'inactive',
                monthly_token_limit INT DEFAULT 10,
                current_month_tokens INT DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        console.log('✅ Tabla users verificada/creada correctamente');
        console.log('');
        console.log('📋 Usuarios actuales:');

        const [users] = await sequelize.query('SELECT id, email, full_name, role FROM users');
        console.table(users);

        await sequelize.close();
        console.log('✅ Completado');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixUsersTable();
