const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true }
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [optionSchema],
  correctOptionIndex: { type: Number, required: true }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  questions: [questionSchema],
  duration: { type: String, required: true },
  deadline: { type: Date, },
  marksPerQuestion: { type: Number, required: true },
  negativeMarks: { type: Number, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
