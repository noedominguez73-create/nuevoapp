/**
 * Script de Inicialización de Base de Datos en Producción
 * 
 * Crea TODAS las tablas necesarias para la aplicación
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.production') });

const { sequelize } = require('../src/config/database');

// Importar TODOS los modelos
const User = require('../src/models/User');
const SalonConfig = require('../src/models/SalonConfig');
const Organization = require('../src/models/Organization');
const MirrorDevice = require('../src/models/MirrorDevice');
const Product = require('../src/models/Product');
const EndCustomer = require('../src/models/EndCustomer');
const GenerationSession = require('../src/models/GenerationSession');
const MirrorItem = require('../src/models/MirrorItem');
const MirrorUsage = require('../src/models/MirrorUsage');
const ClosetItem = require('../src/models/ClosetItem');
const AIConfiguration = require('../src/models/AIConfiguration');
const APIKey = require('../src/models/APIKey');
const ApiConfig = require('../src/models/ApiConfig');
const Audiobooks = require('../src/models/Audiobooks');
const Experts = require('../src/models/Experts');
const Fitness = require('../src/models/Fitness');
const GamesCatalog = require('../src/models/GamesCatalog');
const GameSession = require('../src/models/GameSession');
const GameLeaderboard = require('../src/models/GameLeaderboard');
const TrainingProgram = require('../src/models/TrainingProgram');
const TrainingLesson = require('../src/models/TrainingLesson');
const UserTrainingProgress = require('../src/models/UserTrainingProgress');

// Finance models
const FinanceAccount = require('../src/models/FinanceAccount');
const FinanceBill = require('../src/models/FinanceBill');
const FinanceTransaction = require('../src/models/FinanceTransaction');

async function initDatabase() {
    try {
        console.log('🔗 Conectando a la base de datos...');
        console.log(`   Database: ${process.env.DB_NAME}`);
        console.log(`   Host: ${process.env.DB_HOST}`);
        console.log(`   User: ${process.env.DB_USER}\n`);

        await sequelize.authenticate();
        console.log('✅ Conexión exitosa!\n');

        console.log('📦 Sincronizando TODAS las tablas...\n');

        // Sync all models with { force: false } to avoid dropping existing tables
        await sequelize.sync({ force: false, alter: false });

        console.log('✅ Todas las tablas sincronizadas correctamente!\n');

        // Crear organización demo
        console.log('🏢 Creando organización Demo...');
        const [demoOrg, created] = await Organization.findOrCreate({
            where: { id: 1 },
            defaults: {
                id: 1,
                name: 'Demo Salon',
                slug: 'demo',
                owner_email: 'admin@completmirror.io',
                subscription_status: 'active',
                subscription_plan: 'enterprise'
            }
        });

        if (created) {
            console.log('✅ Organización Demo creada con ID:', demoOrg.id);
        } else {
            console.log('ℹ️  Organización Demo ya existe');
        }

        console.log('\n🎉 Base de datos inicializada exitosamente!');
        console.log('📊 Ahora puedes crear usuarios y empezar a usar la aplicación.\n');

    } catch (error) {
        console.error('❌ Error en inicialización:', error);
        console.error('\nDetalles:', error.message);
        throw error;
    } finally {
        await sequelize.close();
    }
}

initDatabase()
    .then(() => {
        console.log('✨ ¡Listo!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n💥 Inicialización falló:', err.message);
        process.exit(1);
    });
