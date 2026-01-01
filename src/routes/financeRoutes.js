/**
 * Routes for Finance API
 * All routes require authentication and filter by user_id
 */

const express = require('express');
const router = express.Router();
const { FinanceAccount, FinanceTransaction, FinanceBill, FinanceReceivable, FinanceTodo, FinanceCategory } = require('../models/index');
const { authenticateToken } = require('../middleware/authMiddleware.js');

// Middleware: All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/finance/data
 * Get ALL finance data for the user (accounts, transactions, bills, etc)
 */
router.get('/data', async (req, res) => {
    try {
        const userId = req.user.id;

        const [accounts, transactions, bills, receivables, todos, categories] = await Promise.all([
            FinanceAccount.findAll({ where: { user_id: userId }, order: [['created_at', 'ASC']] }),
            FinanceTransaction.findAll({ where: { user_id: userId }, order: [['date', 'DESC']] }),
            FinanceBill.findAll({ where: { user_id: userId }, order: [['due_date', 'ASC']] }),
            FinanceReceivable.findAll({ where: { user_id: userId }, order: [['due_date', 'ASC']] }),
            FinanceTodo.findAll({ where: { user_id: userId }, order: [['created_at', 'DESC']] }),
            FinanceCategory.findAll({ where: { user_id: userId }, order: [['name', 'ASC']] })
        ]);

        res.json({
            accounts,
            transactions,
            bills,
            receivables,
            todos,
            categories
        });
    } catch (error) {
        console.error('Error fetching finance data:', error);
        res.status(500).json({ error: 'Error al cargar datos financieros' });
    }
});

// ============ ACCOUNTS ============

router.get('/accounts', async (req, res) => {
    try {
        const accounts = await FinanceAccount.findAll({
            where: { user_id: req.user.id }
        });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/accounts', async (req, res) => {
    try {
        const account = await FinanceAccount.create({
            user_id: req.user.id,
            ...req.body
        });
        res.status(201).json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/accounts/:id', async (req, res) => {
    try {
        const account = await FinanceAccount.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });
        if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });

        await account.update(req.body);
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/accounts/:id', async (req, res) => {
    try {
        const account = await FinanceAccount.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });
        if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });

        await account.destroy();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ TRANSACTIONS ============

router.get('/transactions', async (req, res) => {
    try {
        const transactions = await FinanceTransaction.findAll({
            where: { user_id: req.user.id },
            order: [['date', 'DESC']]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/transactions', async (req, res) => {
    try {
        const transaction = await FinanceTransaction.create({
            user_id: req.user.id,
            ...req.body
        });

        // Update account balance
        const account = await FinanceAccount.findOne({
            where: { id: req.body.account_id, user_id: req.user.id }
        });

        if (account) {
            const amount = parseFloat(req.body.amount);
            const newBalance = req.body.type === 'income'
                ? parseFloat(account.balance) + amount
                : parseFloat(account.balance) - amount;

            await account.update({ balance: newBalance });
        }

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/transactions/:id', async (req, res) => {
    try {
        const transaction = await FinanceTransaction.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });
        if (!transaction) return res.status(404).json({ error: 'Transacción no encontrada' });

        // Reverse balance change
        const account = await FinanceAccount.findOne({
            where: { id: transaction.account_id, user_id: req.user.id }
        });

        if (account) {
            const amount = parseFloat(transaction.amount);
            const newBalance = transaction.type === 'income'
                ? parseFloat(account.balance) - amount
                : parseFloat(account.balance) + amount;

            await account.update({ balance: newBalance });
        }

        await transaction.destroy();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ BILLS ============

router.get('/bills', async (req, res) => {
    try {
        const bills = await FinanceBill.findAll({
            where: { user_id: req.user.id },
            order: [['due_date', 'ASC']]
        });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/bills', async (req, res) => {
    try {
        const bill = await FinanceBill.create({
            user_id: req.user.id,
            ...req.body
        });
        res.status(201).json(bill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/bills/:id', async (req, res) => {
    try {
        const bill = await FinanceBill.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });
        if (!bill) return res.status(404).json({ error: 'Factura no encontrada' });

        await bill.update(req.body);
        res.json(bill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/bills/:id', async (req, res) => {
    try {
        const bill = await FinanceBill.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });
        if (!bill) return res.status(404).json({ error: 'Factura no encontrada' });

        await bill.destroy();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ CATEGORIES ============

router.get('/categories', async (req, res) => {
    try {
        const categories = await FinanceCategory.findAll({
            where: { user_id: req.user.id }
        });

        // If user has no categories, return default ones
        if (categories.length === 0) {
            const defaultCategories = [
                { name: 'Supermercado', icon: 'shopping-cart', color: '#10b981', subcategories: [] },
                { name: 'Transporte', icon: 'car', color: '#3b82f6', subcategories: ['Gasolina', 'Mantenimiento', 'Uber'] },
                { name: 'Servicios', icon: 'zap', color: '#f59e0b', subcategories: ['Luz', 'Agua', 'Internet'] },
                { name: 'Entretenimiento', icon: 'film', color: '#8b5cf6', subcategories: ['Cine', 'Streaming'] },
                { name: 'Salud', icon: 'heart', color: '#ef4444', subcategories: ['Farmacia', 'Consultas'] }
            ];

            return res.json(defaultCategories);
        }

        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/categories', async (req, res) => {
    try {
        const category = await FinanceCategory.create({
            user_id: req.user.id,
            ...req.body
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
