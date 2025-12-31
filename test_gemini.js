const { Sequelize, DataTypes } = require('sequelize');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

// Setup DB connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
});

const ApiConfig = sequelize.define('ApiConfig', {
    provider: DataTypes.STRING,
    api_key: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    section: DataTypes.STRING,
    settings: DataTypes.JSON
});

async function testGemini() {
    try {
        console.log("🔍 Testing Gemini Connection for 'peinado'...");

        await sequelize.authenticate();
        console.log("✅ DB Connection OK");

        const config = await ApiConfig.findOne({
            where: { section: 'peinado', is_active: true, provider: 'google' }
        });

        if (!config) {
            console.error("❌ No Active Configuration found for section 'peinado'!");
            return;
        }

        console.log("✅ Config Found.");
        console.log(`🔑 API Key: ${config.api_key ? 'Present (Start: ' + config.api_key.substring(0, 4) + '...)' : 'MISSING'}`);

        let modelName = 'gemini-2.0-flash-exp';
        if (config.settings) {
            try {
                const settings = typeof config.settings === 'string' ? JSON.parse(config.settings) : config.settings;
                if (settings.model) modelName = settings.model;
                console.log(`🤖 Model from Settings: ${modelName}`);
            } catch (e) {
                console.log("⚠️ Settings parse error, using default model");
            }
        }

        console.log(`🚀 Attempting generation with model: ${modelName}...`);
        const genAI = new GoogleGenerativeAI(config.api_key);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent("Hello, verify you are working.");
        const text = result.response.text();
        console.log("✅ AI RESPONSE SUCCESS:");
        console.log(text);

    } catch (e) {
        console.error("\n❌ TESTS FAILED:");
        console.error(e.message);
        if (e.response) console.error("API Response:", e.response);
    }
}

testGemini();
