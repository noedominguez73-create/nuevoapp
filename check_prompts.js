const { sequelize } = require('./src/config/database');
const { SalonConfig } = require('./src/models/SalonConfig');

async function checkPrompts() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database');

        const salons = await SalonConfig.findAll({
            attributes: ['id', 'user_id', 'salon_name', 'hairstyle_sys_prompt', 'color_sys_prompt', 'look_sys_prompt_1', 'look_sys_prompt_2']
        });

        console.log(`\n📊 Found ${salons.length} salon(s):\n`);

        salons.forEach((salon, index) => {
            console.log(`--- Salon ${index + 1} ---`);
            console.log(`ID: ${salon.id}`);
            console.log(`User ID: ${salon.user_id}`);
            console.log(`Name: ${salon.salon_name || 'No name'}`);
            console.log(`Has hairstyle_sys_prompt: ${salon.hairstyle_sys_prompt ? 'YES ✅' : 'NO ❌'}`);
            console.log(`Has color_sys_prompt: ${salon.color_sys_prompt ? 'YES ✅' : 'NO ❌'}`);
            console.log(`Has look_sys_prompt_1: ${salon.look_sys_prompt_1 ? 'YES ✅' : 'NO ❌'}`);
            console.log(`Has look_sys_prompt_2: ${salon.look_sys_prompt_2 ? 'YES ✅' : 'NO ❌'}`);

            if (salon.hairstyle_sys_prompt) {
                console.log(`Preview: ${salon.hairstyle_sys_prompt.substring(0, 100)}...`);
            }
            console.log('');
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkPrompts();
