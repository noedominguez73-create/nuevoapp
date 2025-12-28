import { User } from './src/models/index.js';
import { sequelize } from './src/config/database.js';

async function checkUser() {
    try {
        console.log("Connecting to DB...");
        await sequelize.authenticate();
        console.log("DB Connection Info:", sequelize.config);

        const email = 'salon1@gmail.com';
        console.log(`Searching for user: ${email}`);
        const user = await User.findOne({ where: { email } });

        if (user) {
            console.log("✅ User Found:");
            console.log("ID:", user.id);
            console.log("Role:", user.role);
            console.log("Hash:", user.password_hash);
            console.log("Is Salon Owner:", user.is_salon_owner);
        } else {
            console.log("❌ User NOT found.");

            // List all users to see who exists
            const users = await User.findAll({ attributes: ['email', 'role'] });
            console.log("Current Users:", JSON.stringify(users, null, 2));
        }

    } catch (error) {
        console.error("🔥 DB Error:", error);
    } finally {
        await sequelize.close();
    }
}

checkUser();
