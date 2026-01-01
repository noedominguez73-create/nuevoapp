const { verifyToken } = require('../services/authService.js');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = verifyToken(token);
        // Map user_id from token payload to id for route compatibility
        req.user = {
            id: decoded.user_id,  // Routes expect req.user.id
            user_id: decoded.user_id,  // Keep for backward compatibility
            email: decoded.email,
            role: decoded.role
        };
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { authenticateToken };
