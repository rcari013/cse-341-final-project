const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');

const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

// Initialize Express app
const app = express();

// Set the port
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app

  .use(bodyParser.json())
  .use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  }))

  .use(passport.initialize())
  .use(passport.session())

  // CORS Middleware
  .use((req, res, next) => {

    res.setHeader(
      'Access-Control-Allow-Origin',
      '*'
    );

    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );

    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );

    next();
  })

  .use(cors(({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] })))
  .use(cors({ origin: '*' }))
  .use('/', require('./routes'));

// Passport GitHub Strategy
passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/', (req, res) => {
  res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : 'Logged out');
});

app.get('/github/callback', passport.authenticate('github', { failureRedirect: '/api-docs', session: false }), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

// Initialize database and start server
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => console.log(`Database is listening and node is running on port http://localhost:${port}`));
  }
});