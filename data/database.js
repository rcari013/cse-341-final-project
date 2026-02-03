const mongoose = require('mongoose');

let database;

// Initialize the database connection
const initDb = (callback) => {
  if (database) {
    console.log('Db is already initialized!');
    return callback(null, database);
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  mongoose
    .connect(uri)
    .then((conn) => {
      database = conn.connection;
      console.log('MongoDB connected');
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

module.exports = {
  initDb,
  getDatabase
};
