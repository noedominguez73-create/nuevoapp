const express = require('express'); // Restart Triggered: v1.0.5
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Load correct env file FIRST, before database config
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
require('dotenv').config({ path: path.resolve(__dirname, envFile) });

const { sequelize } = require('./src/config/database.js');
const { log, error } = require('./src/utils/logger');
const { setupRoutes } = require('./src/routes/index.js');
const { User, SalonConfig } = require('./src/models/index.js');
const jwt = require('jsonwebtoken');
// ✅ SECURITY FIX: JWT_SECRET ahora es obligatorio en producción
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    error('❌ FATAL: JWT_SECRET not configured!');
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET is required in production. Set it in .env file.');
    }
    console.warn('⚠️  Using default JWT_SECRET for development only');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to block salon users from finance pages
const blockSalonFromFinance = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return next();

    try {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role === 'salon') {
            return res.redirect('/mirror');
        }
        next();
    } catch (err) {
        next();
    }
};

// Middleware
// ✅ SECURITY FIX: CORS restrictivo en producción
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? (process.env.CORS_ORIGIN || '').split(',')
        : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use('/static', express.static(path.join(__dirname, 'app/static')));
app.use('/', express.static(path.join(__dirname, 'app/templates')));

// Health Check (Enhanced)
global.DB_STATUS = 'Starting...';
app.get('/health', (req, res) => {
    res.json({
        status: 'ALIVE',
        mode: 'PRODUCTION_CJS',
        db_status: global.DB_STATUS,
        time: new Date().toISOString()
    });
});

// ✅ SECURITY FIX: Debug endpoint eliminado en producción
if (process.env.NODE_ENV !== 'production') {
    app.get('/debug-db', (req, res) => {
        res.json({
            message: 'Database Configuration (Development Only)',
            config: {
                host: sequelize.config.host,
                port: sequelize.config.port,
                database: sequelize.config.database,
                dialect: sequelize.config.dialect
            },
            status: global.DB_STATUS
        });
    });
}

// Setup API Routes
setupRoutes(app);

// Start Server IMMEDIATELY (Optimistic Startup)
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

// Connect Database in Background
(async () => {
    global.DB_STATUS = 'Connecting...';
    try {
        log("⏳ Connecting to Database...");
        await sequelize.authenticate();
        log("✅ Database Connection ESTABLISHED.");

        log("⏳ Syncing Models...");
        // TEMPORAL: Crear tabla users automáticamente
        if (process.env.NODE_ENV === 'production') {
            await sequelize.sync({ alter: true });  // CAMBIAR A FALSE DESPUÉS
            log("✅ Models Synced (production mode - ALTER ENABLED FOR TABLE CREATION).");
        } else {
            await sequelize.sync({ alter: true });
            log("✅ Models Synced (development mode - with alter).");
        }

        // Auto-Migration: Fase 2 (temporarily disabled for local testing)
        // const { checkAndRunMigrations } = require('./scripts/autoMigrate');
        // await checkAndRunMigrations();

        global.DB_STATUS = 'CONNECTED';

        // Seeder
        const userCount = await User.count();
        if (userCount === 0) {
            log("🌱 Seeding Admin...");
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = await User.create({
                email: 'admin@imagina.ia',
                password_hash: hashedPassword,
                full_name: 'Admin Mirror',
                role: 'admin',
                monthly_token_limit: 1000,
                current_month_tokens: 0
            });
            await SalonConfig.create({
                user_id: admin.id,
                stylist_name: 'Asesora IA',
                primary_color: '#00ff88',
                secondary_color: '#00ccff',
                is_active: true
            });
            log("✅ Seeding Complete.");
        }
    } catch (dbError) {
        error("❌ DB ERROR:", dbError.message);
        error("   Full stack:", dbError.stack);
        global.DB_STATUS = 'ERROR: ' + dbError.message;
    }
})();

// HTML Page Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/registro.html')));
app.get('/mirror', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mirror.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/admin.html')));
app.get('/perfil-usuario', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/perfil-usuario.html')));
app.get('/closet', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/closet.html')));
app.get('/tienda', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/tienda.html')));
app.get('/creditos', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/creditos.html')));
app.get('/referrals', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/referrals.html')));
app.get('/avatar', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/avatar.html')));
app.get('/cambio-de-imagen', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/cambio_de_imagen.html')));
app.get('/fotografia', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/fotografia.html')));
app.get('/profesional', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/profesional.html')));
app.get('/mis-finanzas', blockSalonFromFinance, (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas.html')));
app.get('/mis-finanzas/dashboard', blockSalonFromFinance, (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_dashboard.html')));
app.get('/mis-finanzas/ingresos', blockSalonFromFinance, (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_ingresos.html')));
app.get('/mis-finanzas/pagos', blockSalonFromFinance, (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_pagos.html')));
app.get('/mis-finanzas/facturas', blockSalonFromFinance, (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_facturas.html')));
app.get('/mis-finanzas/pendientes', blockSalonFromFinance, (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_pendientes.html')));
app.get('/mis-finanzas/reportes', blockSalonFromFinance, (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_reportes.html')));
app.get('/control-ia', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/control-ia.html')));
app.get('/admin-login', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/admin-login.html')));
app.get('/admin-mirror', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/admin_mirror.html')));
app.get('/api/mirror/control-pantalla', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/control_pantalla.html')));
app.get('/api/mirror/imagina-ia', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/imagina_ia.html')));
app.get('/api/mirror/admin', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/admin_mirror.html')));

// Fallback
app.get('/:page', (req, res) => {
    const safePath = path.join(__dirname, 'app/templates', `${req.params.page}.html`);
    if (fs.existsSync(safePath)) {
        res.sendFile(safePath);
    } else {
        res.status(404).send('Página no encontrada');
    }
});

// Start Server
// In production (Hostinger), the server is started automatically by LSAPI
// Only call listen() in development/local environments
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`   DB Status: ${global.DB_STATUS}`);
    });
} else {
    console.log(`✅ App ready for production (Hostinger LSAPI)`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log(`   DB Status: ${global.DB_STATUS}`);
}

// Export app for production servers (Hostinger LSAPI/Passenger)
module.exports = app;

