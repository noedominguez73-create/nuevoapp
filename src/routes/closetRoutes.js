/**
 * Routes for Closet IA API
 * All routes require authentication and filter by user_id
 */

const express = require('express');
const router = express.Router();
const { ClosetItem } = require('../models/index');
const { authenticateToken } = require('../middleware/authMiddleware.js');

// Middleware: All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/closet/items
 * Get all closet items for the logged-in user
 */
router.get('/items', async (req, res) => {
    try {
        const userId = req.user.id;

        const items = await ClosetItem.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });

        res.json(items);
    } catch (error) {
        console.error('Error fetching closet items:', error);
        res.status(500).json({ error: 'Error al cargar inventario' });
    }
});

/**
 * GET /api/closet/items/:id
 * Get a specific closet item
 */
router.get('/items/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const itemId = req.params.id;

        const item = await ClosetItem.findOne({
            where: { id: itemId, user_id: userId }
        });

        if (!item) {
            return res.status(404).json({ error: 'Prenda no encontrada' });
        }

        res.json(item);
    } catch (error) {
        console.error('Error fetching closet item:', error);
        res.status(500).json({ error: 'Error al cargar prenda' });
    }
});

/**
 * POST /api/closet/items
 * Create a new closet item
 */
router.post('/items', async (req, res) => {
    try {
        const userId = req.user.id;
        const { categoria, ocasion, imagen_base64, descripcion_ia, color_principal, estilo, temporada } = req.body;

        if (!categoria || !imagen_base64) {
            return res.status(400).json({ error: 'Categoría e imagen son requeridos' });
        }

        const newItem = await ClosetItem.create({
            user_id: userId,
            categoria,
            ocasion,
            imagen_base64,
            descripcion_ia,
            color_principal,
            estilo,
            temporada
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creating closet item:', error);
        res.status(500).json({ error: 'Error al guardar prenda' });
    }
});

/**
 * PUT /api/closet/items/:id
 * Update a closet item
 */
router.put('/items/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const itemId = req.params.id;
        const updates = req.body;

        const item = await ClosetItem.findOne({
            where: { id: itemId, user_id: userId }
        });

        if (!item) {
            return res.status(404).json({ error: 'Prenda no encontrada' });
        }

        await item.update(updates);
        res.json(item);
    } catch (error) {
        console.error('Error updating closet item:', error);
        res.status(500).json({ error: 'Error al actualizar prenda' });
    }
});

/**
 * DELETE /api/closet/items/:id
 * Delete a closet item
 */
router.delete('/items/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const itemId = req.params.id;

        const item = await ClosetItem.findOne({
            where: { id: itemId, user_id: userId }
        });

        if (!item) {
            return res.status(404).json({ error: 'Prenda no encontrada' });
        }

        await item.destroy();
        res.json({ success: true, message: 'Prenda eliminada' });
    } catch (error) {
        console.error('Error deleting closet item:', error);
        res.status(500).json({ error: 'Error al eliminar prenda' });
    }
});

/**
 * GET /api/closet/categories
 * Get items grouped by category
 */
router.get('/categories', async (req, res) => {
    try {
        const userId = req.user.id;

        const items = await ClosetItem.findAll({
            where: { user_id: userId },
            attributes: ['id', 'categoria', 'ocasion', 'created_at'],
            order: [['created_at', 'DESC']]
        });

        // Group by category
        const grouped = items.reduce((acc, item) => {
            if (!acc[item.categoria]) {
                acc[item.categoria] = [];
            }
            acc[item.categoria].push(item);
            return acc;
        }, {});

        res.json(grouped);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Error al cargar categorías' });
    }
});

module.exports = router;
