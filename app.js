const express = require('express');
const connectDb = require('./db/connect');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require('path');
const indexRouter = require('./routes/index');

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
    .use('/', indexRouter)
    .use('/uploads', express.static('uploads'));

app.use(express.static(path.join(__dirname, 'frontend')));

connectDb().then(() => {
    app.listen(port, () => {
        console.log(`Connected to DB and listening on ${port}`);
    });
}).catch(err => {
    console.log('Database connection failed', err);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});
