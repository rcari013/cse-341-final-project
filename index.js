require('dotenv').config();

const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

// Initialize Express app
const app = express();

// Set the port (Render will inject PORT)
const port = process.env.PORT || 3000;

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware
app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
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
  .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }))
  .use(cors({ origin: '*' }))

  // Swagger route
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  // Main routes
  .use('/', require('./routes'));

app.get('/', (req, res) => {
  res.send('API is running');
});

app.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: false
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);
/*
// Initialize database and start server
mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () =>
      console.log(`Server running on port ${port}`)
    );
  }
});
