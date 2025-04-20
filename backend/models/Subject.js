const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'InstructorProfile', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);