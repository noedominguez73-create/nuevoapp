const express = require('express');
const bcrypt = require('bcryptjs');
const { User, SalonConfig } = require('../models/index.js');
const { generateToken } = require('../services/authService.js');
const { authenticateToken } = require('../middleware/authMiddleware.js');
const { MASTER_PROMPTS } = require('../../scripts/seed_master_prompts.js');

const router = express.Router();

// ✅ SECURITY FIX: Debug route eliminado en producción
if (process.env.NODE_ENV !== 'production') {
    router.get('/debug/env', (req, res) => {
        res.json({
            message: 'Environment info (Development Only)',
            nodeEnv: process.env.NODE_ENV || 'development',
            dbConfigured: !!(process.env.DB_NAME && process.env.DB_USER)
        });
    });
}

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        if (!user.password_hash || !user.password_hash.startsWith('$2')) {
            return res.status(401).json({ error: 'Contraseña antigua no compatible.' });
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = generateToken(user);
        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    role: user.role,
                    full_name: user.full_name,
                    email: user.email
                }
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { email, password, full_name } = req.body;

        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ error: 'Email ya registrado' });

        const password_hash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password_hash,
            full_name
        });

        const token = generateToken(newUser);
        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    id: newUser.id,
                    role: newUser.role,
                    full_name: newUser.full_name,
                    email: newUser.email
                }
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/me', authenticateToken, async (req, res) => {
    const user = await User.findByPk(req.user.user_id, {
        attributes: ['id', 'email', 'full_name', 'role', 'current_month_tokens']
    });
    res.json(user);
});

// DISABLED: Guest auto-login removed for security
// router.post('/guest', async (req, res) => { ... });
/*
router.post('/guest', async (req, res) => {
    try {
        let guest = await User.findOne({ where: { email: 'guest@imagina.ia' } });

        if (!guest) {
            const password_hash = await bcrypt.hash('guest123', 10);
            guest = await User.create({
                email: 'guest@imagina.ia',
                password_hash,
                full_name: 'Invitado',
                role: 'user'
            });
        }

        const token = generateToken(guest);
        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: guest.id,
                    role: guest.role,
                    full_name: guest.full_name,
                    email: guest.email
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
*/

router.get('/fix-all-access', async (req, res) => {
    try {
        const accounts = ['salon1@gmail.com', 'salon2@gmail.com'];
        // ✅ SECURITY FIX: Generar password aleatorio en vez de hardcoded
        const crypto = require('crypto');
        const password = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(password, 10);
        const results = [];

        for (const email of accounts) {
            let user = await User.findOne({ where: { email } });

            if (user) {
                user.role = 'salon';
                user.password_hash = hashedPassword;
                await user.save();
                results.push(`Updated ${email}`);
            } else {
                user = await User.create({
                    email,
                    password_hash: hashedPassword,
                    full_name: email.split('@')[0],
                    role: 'salon'
                });
                // ✅ MODIFICADO: Agregar prompts maestros al crear salón
                await SalonConfig.create({
                    user_id: user.id,
                    stylist_name: 'Asesora ' + email.split('@')[0],
                    is_active: true,
                    // Copiar todos los prompts maestros
                    ...MASTER_PROMPTS
                });
                results.push(`Created ${email}`);
            }
        }

        return res.json({
            success: true,
            message: `ACCOUNTS RESTORED: ${results.join(', ')}. Password: ${password}`,
            accounts: results
        });

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

module.exports = router;
