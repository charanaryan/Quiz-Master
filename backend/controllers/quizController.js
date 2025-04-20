const Quiz = require('../models/Quiz');

exports.createQuiz = async (req, res) => {
  try {
    const { marksPerQuestion, negativeMarks } = req.body;

    if (marksPerQuestion <= 0) {
      return res.status(400).json({ error: "Marks per question must be positive." });
    }

    const maxNegative = -Math.floor(marksPerQuestion / 2);
    if (negativeMarks < maxNegative || negativeMarks > 0) {
      return res.status(400).json({
        error: `Negative marks must be between ${maxNegative} and 0.`,
      });
    }

    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { marksPerQuestion, negativeMarks } = req.body;

    if (marksPerQuestion <= 0) {
      return res.status(400).json({ error: "Marks per question must be positive." });
    }

    const maxNegative = -Math.floor(marksPerQuestion / 2);
    if (negativeMarks < maxNegative || negativeMarks > 0) {
      return res.status(400).json({
        error: `Negative marks must be between ${maxNegative} and 0.`,
      });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedQuiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(updatedQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getQuizzesByTopic = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ topicId: req.params.topicId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitQuizAttempt = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const totalQuestions = quiz.questions.length;
    let score = 0;
    const correctAnswers = [];

    quiz.questions.forEach((q, i) => {
      const correctIndex = q.correctOptionIndex;
      correctAnswers.push(correctIndex);

      if (answers[i] === correctIndex) {
        score += quiz.marksPerQuestion;
      } else {
        score -= quiz.negativeMarks;
      }
    });

    res.json({
      score,
      totalQuestions,
      totalMarks: totalQuestions * quiz.marksPerQuestion,
      correctAnswers,
      studentAnswers: answers,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
