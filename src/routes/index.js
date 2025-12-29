const express = require('express');
const authRoutes = require('./authRoutes.js');
const mirrorRoutes = require('./mirrorRoutes.js');
const adminRoutes = require('./adminRoutes.js');

const setupRoutes = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/mirror', mirrorRoutes);
    app.use('/api/admin', adminRoutes);
};

module.exports = { setupRoutes };
