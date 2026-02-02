const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');

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

app.get('/', (req, res) => {
  res.send('API is running');
});

// Initialize database and start server
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => console.log(`Database is listening and node is running on port http://localhost:${port}`));
  }
});
