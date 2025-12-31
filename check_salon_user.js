const { sequelize } = require('./src/config/database');

(async () => {
    try {
        const [users] = await sequelize.query(`
            SELECT id, email, role, organization_id, created_at
            FROM users
            WHERE email = 'salon@gmail.com'
        `);

        if (users.length === 0) {
            console.log('❌ Usuario no encontrado');
        } else {
            console.log('✅ Usuario encontrado:\n');
            console.log(users[0]);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();
