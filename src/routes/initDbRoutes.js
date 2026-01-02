/**
 * Ruta temporal para inicializar la base de datos en producción
 * ELIMINAR DESPUÉS DE USAR
 */

const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

// Import all models to ensure they're registered
const User = require('../models/User');
const SalonConfig = require('../models/SalonConfig');
const Organization = require('../models/Organization');
const MirrorDevice = require('../models/MirrorDevice');
const Product = require('../models/Product');
const EndCustomer = require('../models/EndCustomer');
const GenerationSession = require('../models/GenerationSession');
const MirrorItem = require('../models/MirrorItem');
const MirrorUsage = require('../models/MirrorUsage');
const ClosetItem = require('../models/ClosetItem');
const AIConfiguration = require('../models/AIConfiguration');
const APIKey = require('../models/APIKey');
const ApiConfig = require('../models/ApiConfig');
const Audiobooks = require('../models/Audiobooks');
const Experts = require('../models/Experts');
const Fitness = require('../models/Fitness');
const GamesCatalog = require('../models/GamesCatalog');
const GameSession = require('../models/GameSession');
const GameLeaderboard = require('../models/GameLeaderboard');
const TrainingProgram = require('../models/TrainingProgram');
const TrainingLesson = require('../models/TrainingLesson');
const UserTrainingProgress = require('../models/UserTrainingProgress');
const FinanceAccount = require('../models/FinanceAccount');
const FinanceBill = require('../models/FinanceBill');
const FinanceTransaction = require('../models/FinanceTransaction');

router.get('/init-database-secret-route-2026', async (req, res) => {
    try {
        const results = [];

        results.push('🔗 Conectando a la base de datos...');
        await sequelize.authenticate();
        results.push('✅ Conexión exitosa!');

        results.push('📦 Sincronizando TODAS las tablas...');

        // Sync all models
        await sequelize.sync({ force: false, alter: false });

        results.push('✅ Todas las tablas sincronizadas!');

        // Create demo organization
        results.push('🏢 Creando organización Demo...');
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
            results.push('✅ Organización Demo creada con ID: ' + demoOrg.id);
        } else {
            results.push('ℹ️  Organización Demo ya existe');
        }

        results.push('');
        results.push('🎉 Base de datos inicializada exitosamente!');
        results.push('📊 Ahora puedes crear usuarios y usar la aplicación.');
        results.push('');
        results.push('⚠️  IMPORTANTE: Elimina esta ruta de seguridad después de usarla.');

        res.send('<pre>' + results.join('\n') + '</pre>');

    } catch (error) {
        res.status(500).send('<pre>❌ Error: ' + error.message + '\n\n' + error.stack + '</pre>');
    }
});

module.exports = router;
