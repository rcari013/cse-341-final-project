const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// MongoDB connection setup
const MongoClient = require('mongodb').MongoClient;

let database;

// Initialize the database connection
const initDb = (callback) => {

  // If database is already initialized, return it
  if (database) {
    console.log('Db is already initialized!');
    return callback(null, database);
  }

  // Connect to MongoDB
  MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
      database = client;
      callback(null, database);
    })
    .catch((err) => {
      callback(err);
    });
}

// Get the database instance
const getDatabase = () => {
  if (!database) {
    throw Error('Database not initialized')
  }
  return database;
}

// Export the initDb and getDatabase functions
module.exports = {
  initDb,
  getDatabase
}