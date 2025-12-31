/**
 * Verifica y crea usuario salon@gmail.com si no existe
 */

const { sequelize } = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function setupUser() {
    try {
        console.log('🔍 Verificando usuarios en la base de datos...\n');

        // Ver usuarios existentes
        const [users] = await sequelize.query(`
            SELECT id, email, role, organization_id, full_name 
            FROM users
        `);

        console.log('📋 Usuarios existentes:');
        users.forEach(u => {
            console.log(`   - ${u.email} (${u.role}) - Org: ${u.organization_id}`);
        });

        // Buscar salon@gmail.com
        const [existing] = await sequelize.query(`
            SELECT * FROM users WHERE email = 'salon@gmail.com'
        `);

        if (existing.length > 0) {
            console.log('\n✅ Usuario salon@gmail.com ya existe');
            console.log('Actualizando password a: 102o3o4o');

            const hashedPassword = await bcrypt.hash('102o3o4o', 10);
            await sequelize.query(`
                UPDATE users 
                SET password_hash = ?, organization_id = 1, role = 'salon'
                WHERE email = 'salon@gmail.com'
            `, {
                replacements: [hashedPassword]
            });

            console.log('✅ Password actualizado');
        } else {
            console.log('\n❌ Usuario salon@gmail.com NO existe');
            console.log('Creándolo ahora...');

            const hashedPassword = await bcrypt.hash('102o3o4o', 10);
            await sequelize.query(`
                INSERT INTO users (email, password_hash, full_name, role, organization_id)
                VALUES ('salon@gmail.com', ?, 'Salon Demo', 'salon', 1)
            `, {
                replacements: [hashedPassword]
            });

            console.log('✅ Usuario creado');
        }

        console.log('\n✨ CREDENCIALES LISTAS:');
        console.log('   Email: salon@gmail.com');
        console.log('   Password: 102o3o4o');
        console.log('   Rol: Salón');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

setupUser();
