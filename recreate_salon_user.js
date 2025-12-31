const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/database');

(async () => {
    try {
        console.log('🔧 Arreglando usuario salon@gmail.com...\n');

        // Borrar si existe
        await sequelize.query(`DELETE FROM users WHERE email = 'salon@gmail.com'`);
        console.log('✅ Usuario anterior eliminado');

        // Crear de nuevo correctamente
        const hash = await bcrypt.hash('1020304o', 10);
        await sequelize.query(`
            INSERT INTO users (email, password_hash, role, organization_id, created_at) 
            VALUES ('salon@gmail.com', ?, 'salon', 1, NOW())
        `, {
            replacements: [hash]
        });

        console.log('✅ Usuario recreado correctamente');
        console.log('\n📋 CREDENCIALES:');
        console.log('   Email: salon@gmail.com');
        console.log('   Password: 1020304o');
        console.log('   Org ID: 1');
        console.log('   Role: salon\n');

        // Verificar
        const [users] = await sequelize.query(`
            SELECT email, role, organization_id 
            FROM users 
            WHERE email = 'salon@gmail.com'
        `);

        console.log('✅ Verificado en DB:', users[0]);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error(err);
        process.exit(1);
    }
})();
