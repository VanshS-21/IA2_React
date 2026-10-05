const mongoose = require("mongoose");
const { mongoUri } = require("./env");

let connectionPromise;

async function connectDb(uri = mongoUri) {
  mongoose.set("strictQuery", true);
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;
  connectionPromise = mongoose
    .connect(uri)
    .then(() => mongoose.connection)
    .catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  return connectionPromise;
}

module.exports = { connectDb };
