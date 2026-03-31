const mongoose = require("mongoose");
const { MONGODB_URI } = require("../config/env");

const connectDB = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
};

module.exports = connectDB;
