const  mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: Object,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const users = mongoose.model("users", userSchema);

module.exports =  users;
