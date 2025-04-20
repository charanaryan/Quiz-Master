const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
});

module.exports = mongoose.model('Topic', TopicSchema);