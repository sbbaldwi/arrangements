const express = require('express');
const routes = express.Router();

const accountsRouter = require('./accounts');
const arrangementsRouter = require('./arrangements');
const cartRouter = require('./cart');

routes.use('/accounts', accountsRouter);
routes.use('/arrangements', arrangementsRouter);
routes.use('/cart', cartRouter);


module.exports = routes;