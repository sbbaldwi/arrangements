const express = require('express');
const routes = express.Router();

const accountsRouter = require('./accounts');

routes.use('/accounts', accountsRouter);

module.exports = routes;