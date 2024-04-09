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

app.get('/files/pdf/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.type('application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + req.params.filename + '"');
    res.sendFile(filePath);
  });
  
  // Example route for audio files, usually handled well by browsers' native audio players
  app.get('/files/audio/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.type('audio/mpeg');
    res.sendFile(filePath);
  });

app.use(passport.initialize());
app.use(passport.session());

app
    .use(cors())
    .use(express.json())
    .use('/', require('./routes/index'))
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use('/uploads', express.static('uploads'));

connectDb().then(() => {
    // Server starts only after the MongoDB connection is successful
    app.listen(port, () => {
        console.log(`Connected to DB and listening on ${port}`);
    });
}).catch(err => {
    console.log('Database connection failed', err);
});