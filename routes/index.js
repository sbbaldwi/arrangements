const express = require('express');
const routes = express.Router();
const path = require('path');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Serve login and register pages
routes.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

routes.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'register.html'));
});

// Google OAuth routes
routes.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

routes.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to /api-docs.
        res.redirect('/api-docs');
    });

// Swagger UI
routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = routes;
