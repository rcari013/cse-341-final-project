const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let database;

/**
 * Initialize the database connection
 */
const initDb = (callback) => {
  if (database) {
    console.log('Database is already initialized!');
    return callback(null, database);
  }

  if (!process.env.MONGODB_URI) {
    return callback(
      new Error('MONGODB_URI is not defined in the environment variables')
    );
  }

  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      database = client.db(); // uses DB from URI
      console.log('Database connected successfully');
      callback(null, database);
    })
    .catch((err) => {
      callback(err);
    });
};

/**
 * Get the database instance
 */
const getDatabase = () => {
  if (!database) {
    throw Error('Database not initialized');
  }
  return database;
};

module.exports = {
  initDb,
  getDatabase
};
