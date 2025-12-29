import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// import { sequelize } from './src/config/database.js'; // DISABLE DB
// import { setupRoutes } from './src/routes/index.js'; // DISABLE ROUTES
// import { User, SalonConfig } from './src/models/index.js'; // DISABLE MODELS
import bcrypt from 'bcryptjs';

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// DIAGNOSTIC HEALTH CHECK (Bypasses DB/Auth)
app.get('/health', (req, res) => res.status(200).send(`Server is ALIVE! Time: ${new Date().toISOString()}`));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DB/CODE DISABLED FOR DEBUGGING ---
/*
// --- HOTFIX FOR BROKEN CACHED URLS ---
app.use((req, res, next) => {
    // ...
    next();
});
*/

// Static Files
app.use('/static', express.static(path.join(__dirname, 'app/static')));
app.use('/', express.static(path.join(__dirname, 'app/templates')));

// ... DB LOGIC DISABLED ...
/*
// --- DB INITIALIZATION WITH SAFETY CHECKS ---
(async () => {
    try {
        console.log("⏳ Testing Database Connection...");
        await sequelize.authenticate();
        console.log("✅ Connection has been established successfully.");

        console.log("⏳ Syncing Database Models...");
        await sequelize.sync({ alter: true });
        console.log("✅ Database synced successfully.");

        // --- SEEDER LOGIC ---
        const userCount = await User.count();
        if (userCount === 0) {
           // ...
        }

    } catch (error) {
        console.error("❌ DATABASE FATAL ERROR:", error.message);
        console.error("   (Server will continue running in Limited Mode)");
    }
})();
*/

// Routes
// setupRoutes(app); // DISABLED

// Serve HTML Pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/registro.html'));
});

app.get('/mirror', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/mirror.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/admin.html'));
});

app.get('/perfil-usuario', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/perfil-usuario.html'));
});

// Mirror App UI Routes
app.get('/api/mirror/control-pantalla', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/control_pantalla.html'));
});
app.get('/api/mirror/imagina-ia', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/imagina_ia.html'));
});
app.get('/api/mirror/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/admin_mirror.html'));
});

// Admin & Dashboard Routes
app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/admin-login.html'));
});
app.get('/dashboard-profesional', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/dashboard-profesional.html'));
});
app.get('/chatbot-config', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/chatbot-config.html'));
});
app.get('/chat-history', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/chat-history.html'));
});

// User Feature Routes
app.get('/closet', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/closet.html'));
});
app.get('/tienda', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/tienda.html'));
});
app.get('/creditos', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/creditos.html'));
});
app.get('/referrals', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/referrals.html'));
});
app.get('/avatar', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/avatar.html'));
});
app.get('/cambio-de-imagen', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/cambio_de_imagen.html'));
});
app.get('/fotografia', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/fotografia.html'));
});
app.get('/profesional', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/profesional.html'));
});

// Finances Routes (Mis Finanzas)
app.get('/mis-finanzas', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas.html'));
});
app.get('/mis-finanzas/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_dashboard.html'));
});
app.get('/mis-finanzas/ingresos', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_ingresos.html'));
});
app.get('/mis-finanzas/pagos', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_pagos.html'));
});
app.get('/mis-finanzas/facturas', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_facturas.html'));
});
app.get('/mis-finanzas/pendientes', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_pendientes.html'));
});
app.get('/mis-finanzas/reportes', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_reportes.html'));
});
app.get('/admin-mirror', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/templates/admin_mirror.html'));
});

// Fallback for any other HTML files in templates if needed, or 404
app.get('/:page', (req, res) => {
    const page = req.params.page;
    // Prevent directory traversal
    const safePath = path.join(__dirname, 'app/templates', `${page}.html`);
    const rootPath = path.join(__dirname, 'app/templates');

    if (safePath.startsWith(rootPath) && fs.existsSync(safePath)) {
        res.sendFile(safePath);
    } else {
        // Maybe it's a file without .html extension in URL?
        if (fs.existsSync(safePath)) {
            res.sendFile(safePath);
        } else {
            res.status(404).send('Página no encontrada');
        }
    }
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend accessible at http://localhost:${PORT}`);
});
