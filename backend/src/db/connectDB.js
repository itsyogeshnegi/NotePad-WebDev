const mongoose = require("mongoose");
const { MONGODB_URI } = require("../config/env");

const connectDB = async () => {
  if (!MONGODB_URI) {
    throw new Error(
      "MongoDB URI is not configured. Set MONGODB_URI, DATABASE_URL, or MONGO_URI in your environment."
    );
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
};

module.exports = connectDB;
