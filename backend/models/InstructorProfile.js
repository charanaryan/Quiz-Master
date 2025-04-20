const mongoose = require('mongoose');

const InstructorProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    required: false
  },
}, { timestamps: true });

module.exports = mongoose.model('InstructorProfile', InstructorProfileSchema);


