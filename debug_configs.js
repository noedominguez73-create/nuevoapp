const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Setup DB connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
});

// Define Models (simplified)
const SalonConfig = sequelize.define('SalonConfig', {
    user_id: DataTypes.INTEGER,
    hairstyle_sys_prompt: DataTypes.TEXT,
    color_sys_prompt: DataTypes.TEXT
});

const ApiConfig = sequelize.define('ApiConfig', {
    provider: DataTypes.STRING,
    api_key: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    section: DataTypes.STRING,
    settings: DataTypes.JSON
});

async function checkConfigs() {
    try {
        await sequelize.authenticate();

        console.log("--- Checking SalonConfig (User 1) ---");
        const salonConfig = await SalonConfig.findOne({ where: { user_id: 1 } });
        if (salonConfig) {
            console.log("SalonConfig found.");
            console.log("Hairstyle Prompt Length:", salonConfig.hairstyle_sys_prompt ? salonConfig.hairstyle_sys_prompt.length : 0);
        } else {
            console.log("❌ SalonConfig NOT found");
        }

        console.log("\n--- Checking ApiConfig (Peinado) ---");
        const apiConfig = await ApiConfig.findOne({
            where: { section: 'peinado', is_active: true, provider: 'google' }
        });

        if (apiConfig) {
            console.log("✅ Active API Key found for 'peinado'");
            console.log("Settings:", apiConfig.settings);
        } else {
            console.log("❌ No active API Key for 'peinado'");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

checkConfigs();
