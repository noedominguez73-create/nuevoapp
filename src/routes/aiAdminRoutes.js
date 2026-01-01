const express = require('express');
const router = express.Router();
const AIConfiguration = require('../models/AIConfiguration');
const APIKey = require('../models/APIKey');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Middleware: Solo admin
router.use(authMiddleware, adminMiddleware);

// ============ AI CONFIGURATIONS ============

// GET /api/admin/ai-configs - Get all AI configurations
router.get('/ai-configs', async (req, res) => {
    try {
        const org_id = (req.user && req.user.organization_id) || 1;
        console.log('[AI Configs] Fetching for organization_id:', org_id);

        const configs = await AIConfiguration.findAll({
            where: { organization_id: org_id },
            order: [['id', 'ASC']]
        });

        console.log('[AI Configs] Found:', configs.length, 'configurations');

        res.json({
            success: true,
            configs
        });
    } catch (error) {
        console.error('Error fetching AI configs:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener configuraciones de IA',
            details: error.message
        });
    }
});

// POST /api/admin/ai-configs - Create or update AI configuration
router.post('/ai-configs', async (req, res) => {
    try {
        const { id, name, function: functionName, description, enabled, provider, model, hasVision, systemPrompt, parameters } = req.body;

        const [config, created] = await AIConfiguration.upsert({
            id: id || functionName,
            name,
            function: functionName,
            description,
            enabled,
            provider,
            model,
            hasVision,
            systemPrompt,
            parameters,
            organization_id: req.user.organization_id || 1
        });

        res.json({
            success: true,
            config,
            created
        });
    } catch (error) {
        console.error('Error saving AI config:', error);
        res.status(500).json({
            success: false,
            error: 'Error al guardar configuración de IA'
        });
    }
});

// DELETE /api/admin/ai-configs/:id - Delete AI configuration
router.delete('/ai-configs/:id', async (req, res) => {
    try {
        const deleted = await AIConfiguration.destroy({
            where: {
                id: req.params.id,
                organization_id: req.user.organization_id || 1
            }
        });

        if (deleted) {
            res.json({ success: true });
        } else {
            res.status(404).json({
                success: false,
                error: 'Configuración no encontrada'
            });
        }
    } catch (error) {
        console.error('Error deleting AI config:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar configuración'
        });
    }
});

// PATCH /api/admin/ai-configs/:id/usage - Update usage stats
router.patch('/ai-configs/:id/usage', async (req, res) => {
    try {
        const { tokens, images, cost } = req.body;
        const config = await AIConfiguration.findOne({
            where: {
                id: req.params.id,
                organization_id: req.user.organization_id || 1
            }
        });

        if (!config) {
            return res.status(404).json({
                success: false,
                error: 'IA no encontrada'
            });
        }

        const updatedStats = {
            totalTokens: (config.usageStats.totalTokens || 0) + (tokens || 0),
            totalImages: (config.usageStats.totalImages || 0) + (images || 0),
            totalCost: (config.usageStats.totalCost || 0) + (cost || 0),
            lastUsed: new Date().toISOString()
        };

        await config.update({ usageStats: updatedStats });

        res.json({
            success: true,
            usageStats: updatedStats
        });
    } catch (error) {
        console.error('Error updating usage:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar estadísticas'
        });
    }
});

// ============ API KEYS ============

// GET /api/admin/api-keys - Get all API keys (censored)
router.get('/api-keys', async (req, res) => {
    try {
        const keys = await APIKey.findAll({
            where: { organization_id: req.user.organization_id || 1 }
        });

        const censoredKeys = keys.map(key => ({
            provider: key.provider,
            isValid: key.isValid,
            lastValidated: key.lastValidated,
            lastUsed: key.lastUsed,
            // Show only first 6 and last 4 chars
            keyPreview: key.getDecryptedKey().slice(0, 6) + '...' + key.getDecryptedKey().slice(-4)
        }));

        res.json({
            success: true,
            keys: censoredKeys
        });
    } catch (error) {
        console.error('Error fetching API keys:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener API keys'
        });
    }
});

// POST /api/admin/api-keys - Save/Update API keys
router.post('/api-keys', async (req, res) => {
    try {
        const { gemini, openai, replicate, anthropic } = req.body;
        const organization_id = req.user.organization_id || 1;
        const savedKeys = [];

        if (gemini) {
            const { encryptedKey, iv } = APIKey.encryptKey(gemini);
            await APIKey.upsert({
                provider: 'gemini',
                encryptedKey,
                iv,
                isValid: false,
                organization_id
            });
            savedKeys.push('gemini');
        }

        if (openai) {
            const { encryptedKey, iv } = APIKey.encryptKey(openai);
            await APIKey.upsert({
                provider: 'openai',
                encryptedKey,
                iv,
                isValid: false,
                organization_id
            });
            savedKeys.push('openai');
        }

        if (replicate) {
            const { encryptedKey, iv } = APIKey.encryptKey(replicate);
            await APIKey.upsert({
                provider: 'replicate',
                encryptedKey,
                iv,
                isValid: false,
                organization_id
            });
            savedKeys.push('replicate');
        }

        if (anthropic) {
            const { encryptedKey, iv } = APIKey.encryptKey(anthropic);
            await APIKey.upsert({
                provider: 'anthropic',
                encryptedKey,
                iv,
                isValid: false,
                organization_id
            });
            savedKeys.push('anthropic');
        }

        res.json({
            success: true,
            message: `API Keys guardadas: ${savedKeys.join(', ')}`
        });
    } catch (error) {
        console.error('Error saving API keys:', error);
        res.status(500).json({
            success: false,
            error: 'Error al guardar API keys'
        });
    }
});

// ============ STATISTICS ============

// GET /api/admin/ai-stats - Get usage statistics
router.get('/ai-stats', async (req, res) => {
    try {
        const configs = await AIConfiguration.findAll({
            where: { organization_id: req.user.organization_id || 1 }
        });

        let totalTokens = 0;
        let totalImages = 0;
        let totalCost = 0;
        const byAI = {};

        configs.forEach(config => {
            const stats = config.usageStats || {};
            totalTokens += stats.totalTokens || 0;
            totalImages += stats.totalImages || 0;
            totalCost += stats.totalCost || 0;

            byAI[config.id] = {
                name: config.name,
                tokens: stats.totalTokens || 0,
                images: stats.totalImages || 0,
                cost: stats.totalCost || 0,
                lastUsed: stats.lastUsed
            };
        });

        res.json({
            success: true,
            stats: {
                totalTokens,
                totalImages,
                estimatedCost: totalCost,
                byAI
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener estadísticas'
        });
    }
});

module.exports = router;
