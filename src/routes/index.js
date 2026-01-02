const express = require('express');
const authRoutes = require('./authRoutes.js');
const mirrorRoutes = require('./mirrorRoutes.js');
const adminRoutes = require('./adminRoutes.js');
const financeRoutes = require('./financeRoutes.js');
const closetRoutes = require('./closetRoutes.js');
const aiAdminRoutes = require('./aiAdminRoutes.js');
const initDbRoutes = require('./initDbRoutes.js'); // Temporary - for DB initialization

const setupRoutes = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/mirror', mirrorRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/admin', aiAdminRoutes); // AI Admin routes
    app.use('/api/finance', financeRoutes);
    app.use('/api/closet', closetRoutes);
    app.use('/api', initDbRoutes); // TEMPORARY - remove after DB init
};

module.exports = { setupRoutes };
