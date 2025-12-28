import express from 'express';
import authRoutes from './authRoutes.js';
import mirrorRoutes from './mirrorRoutes.js';
import adminRoutes from './adminRoutes.js';

export const setupRoutes = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/mirror', mirrorRoutes);
    app.use('/api/admin', adminRoutes);

    // Add other routes here
};
