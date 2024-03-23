const express = require('express');
const routes = express.Router();

const accountsRouter = require('./accounts');
const arrangementsRouter = require('./arrangements');

routes.use('/accounts', accountsRouter);
routes.use('/arrangements', arrangementsRouter);

module.exports = routes;