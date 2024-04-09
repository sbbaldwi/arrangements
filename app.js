const express = require('express');
const mongodb = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

const port = process.env.PORT || 8080;
const app = express();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: CONNECTION_STRING
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app
    .use(cors())
    .use(express.json())
    .use('/', require('./routes/index'))
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/uploads', express.static('uploads'));


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, cb) {
        const db = getDb();
        const collection = db.collection('account');
        let user = await collection.findOne({ googleId: profile.id });

        if (!user) {
            // Create a new user if not found
            user = await collection.insertOne({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                // Mark the account as needing profile completion
                profileComplete: false
            });
        }

        // If user exists but profile is incomplete, handle accordingly
        if (user && !user.profileComplete) {
            // Logic to mark for profile completion
        }

        cb(null, user);
    }
));

// Serialize and deserialize user instances to and from the session.
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate With Google</a>');
})

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Redirecting to the api-docs page upon successful authentication
        res.redirect('https://brichristiansenarrangements.onrender.com/api-docs');
    }
);

mongodb.initDb((err, mongodb) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port);
        console.log(`Connected to DB and listening on ${port}`);
    }
});