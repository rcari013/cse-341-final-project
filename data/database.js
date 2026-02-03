const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();

let database;

// Initialize the database connection
const initDb = (callback) => {
  // If database is already initialized, return it
  if (database) {
    console.log('Db is already initialized!');
    return callback(null, database);
  }

  mongoose.connect(process.env.MONGODB_URL)
    .then((conn) => {
      database = conn.connection;
      callback(null, database);
    })
    .catch((err) => {
      callback(err);
    });
};

// Get the database instance
const getDatabase = () => {
  if (!database) {
    throw Error('Database not initialized');
  }
  return database;
};

// Export the initDb and getDatabase functions
module.exports = {
  initDb,
  getDatabase
};
