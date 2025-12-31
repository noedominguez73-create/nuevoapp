const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/database');

(async () => {
    try {
        const hash = await bcrypt.hash('102o3o4o', 10);

        await sequelize.query(`
            INSERT INTO users (email, password_hash, role, organization_id) 
            VALUES ('salon@gmail.com', ?, 'salon', 1)
        `, {
            replacements: [hash]
        });

        console.log('✅ Usuario creado: salon@gmail.com');
        console.log('✅ Password: 102o3o4o');
        process.exit(0);
    } catch (err) {
        if (err.message.includes('Duplicate entry')) {
            console.log('⏩ Usuario ya existe, actualizando password...');
            const hash = await bcrypt.hash('102o3o4o', 10);
            await sequelize.query(`
                UPDATE users 
                SET password_hash = ?, organization_id = 1, role = 'salon'
                WHERE email = 'salon@gmail.com'
            `, {
                replacements: [hash]
            });
            console.log('✅ Password actualizado: 102o3o4o');
            process.exit(0);
        } else {
            console.error('❌ Error:', err.message);
            process.exit(1);
        }
    }
})();
