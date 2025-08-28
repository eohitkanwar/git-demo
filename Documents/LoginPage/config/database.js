const mongoose = require("mongoose");

const databaseConnection = async (res) => {
  try {
    await mongoose.connect("mongodb://localhost:27017/users");
    console.log("MongoDB COnnected");
  } catch (error) {
    return res.status(500).json({
      message: "Failed To Connected Db",
    });
  }
};

module.exports = databaseConnection;
