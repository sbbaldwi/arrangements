const express = require('express');
const connectDb = require('./db/connect'); 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const port = process.env.PORT || 8080;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,     
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL: "/auth/google/callback"       
},
    function (accessToken, refreshToken, profile, cb) {
        cb(null, profile);
    }
));


app.use(session({
    secret: process.env.SESSION_SECRET,  
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.CONNECTION_STRING
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/accounts/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});
app.get('/accounts/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'register.html'));
});
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect to /api-docs.
        res.redirect('/api-docs');
    });
// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Serve API routes
app.use('/', require('./routes/index'));
// Serve uploads as static files
app.use('/uploads', express.static('uploads'));
// Custom error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});
// Connection to MongoDB and server start
connectDb().then(() => {
    app.listen(port, () => {
        console.log(`Connected to DB and listening on ${port}`);
    });
}).catch(err => {
    console.error('Database connection failed', err);
});