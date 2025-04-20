const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  bio: { type: String },
  profilePicture: { type: String },
});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);