const express = require('express');
const connectDb = require('./db/connect'); // Adjusted to the new Mongoose connection setup
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.CONNECTION_STRING
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app
    .use(cors())
    .use(express.json())
    .use('/', require('./routes/index'))
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.use(express.static(path.join(__dirname, 'frontend')));

// Define a route to serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

connectDb().then(() => {
    // Server starts only after the MongoDB connection is successful
    app.listen(port, () => {
        console.log(`Connected to DB and listening on ${port}`);
    });
}).catch(err => {
    console.log('Database connection failed', err);
});