/**
 * Crear tablas de Closet IA con separación por usuario
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('u182581262_appnode', 'root', '1020304050', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: console.log
});

async function createClosetTables() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL exitosa\n');

        console.log('👗 Creando tablas de Closet IA...\n');

        // Tabla: closet_items
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS closet_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                categoria VARCHAR(100) NOT NULL,
                ocasion VARCHAR(50),
                imagen_base64 LONGTEXT NOT NULL,
                descripcion_ia TEXT,
                color_principal VARCHAR(50),
                estilo VARCHAR(100),
                temporada VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_categoria (categoria),
                INDEX idx_ocasion (ocasion),
                INDEX idx_user_categoria (user_id, categoria)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Tabla closet_items creada');

        // Tabla: closet_outfits (opcional - combinaciones guardadas)
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS closet_outfits (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                nombre VARCHAR(255) NOT NULL,
                ocasion VARCHAR(50),
                items JSON NOT NULL,
                imagen_preview LONGTEXT,
                favorito BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_favorito (favorito)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Tabla closet_outfits creada');

        console.log('\n✅ ¡TABLAS DE CLOSET IA CREADAS EXITOSAMENTE!\n');
        console.log('📋 Resumen:');
        console.log('   - closet_items (Inventario de prendas)');
        console.log('   - closet_outfits (Combinaciones guardadas)');
        console.log('\n🔒 Separación por usuario:');
        console.log('   → María solo ve SU ropa');
        console.log('   → Luisa solo ve SU ropa');
        console.log('   → Juan solo ve SU ropa\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

createClosetTables();
