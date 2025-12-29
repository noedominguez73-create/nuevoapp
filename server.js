import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { sequelize } from './src/config/database.js';
import { setupRoutes } from './src/routes/index.js';
import { User, SalonConfig } from './src/models/index.js';
import bcrypt from 'bcryptjs';

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML Pages (Backend Rendered or Static)
app.use('/static', express.static(path.join(__dirname, 'app/static')));
app.use('/', express.static(path.join(__dirname, 'app/templates')));

// Health Check
app.get('/health', (req, res) => res.status(200).send(`Server is ALIVE! Mode: STANDARD - Time: ${new Date().toISOString()}`));

// Initialize Server Logic
(async () => {
    try {
        console.log("🚀 Starting Server Initialization...");

        // 1. Database Connection
        try {
            console.log("⏳ Connecting to Database...");
            await sequelize.authenticate();
            console.log("✅ Database Connection ESTABLISHED.");

            console.log("⏳ Syncing Models...");
            await sequelize.sync({ alter: true });
            console.log("✅ Models Synced.");

            // Seeder
            const userCount = await User.count();
            if (userCount === 0) {
                console.log("🌱 Database Empty. Seeding Admin...");
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
                    stylist_voice_name: 'Aoede',
                    is_active: true
                });
                console.log("✅ Seeding Complete.");
            }

        } catch (dbError) {
            console.error("❌ DATABASE ERROR (Non-Fatal for Server Start):", dbError.message);
            // We continue so the server can minimally start and we can see logs
        }

        // 2. Setup Routes
        console.log("⏳ Setting up Routes...");
        setupRoutes(app);
        console.log("✅ Routes Configured.");

        // 3. Bind Port
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });

    } catch (fatalError) {
        console.error("❌ FATAL SERVER ERROR:", fatalError);
    }
})();

// ==========================================
// 📄 PAGE ROUTES (HTML Service)
// ==========================================

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/registro.html')));
app.get('/mirror', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mirror.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/admin.html')));
app.get('/perfil-usuario', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/perfil-usuario.html')));

// Feature Routes
app.get('/closet', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/closet.html')));
app.get('/tienda', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/tienda.html')));
app.get('/creditos', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/creditos.html')));
app.get('/referrals', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/referrals.html')));
app.get('/avatar', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/avatar.html')));
app.get('/cambio-de-imagen', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/cambio_de_imagen.html')));
app.get('/fotografia', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/fotografia.html')));
app.get('/profesional', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/profesional.html')));

// Finances
app.get('/mis-finanzas', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas.html')));
app.get('/mis-finanzas/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_dashboard.html')));
app.get('/mis-finanzas/ingresos', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_ingresos.html')));
app.get('/mis-finanzas/pagos', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_pagos.html')));
app.get('/mis-finanzas/facturas', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_facturas.html')));
app.get('/mis-finanzas/pendientes', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_pendientes.html')));
app.get('/mis-finanzas/reportes', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/mis_finanzas_reportes.html')));

// Admin
app.get('/admin-login', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/admin-login.html')));
app.get('/admin-mirror', (req, res) => res.sendFile(path.join(__dirname, 'app/templates/admin_mirror.html')));

// API/Mirror specific
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
