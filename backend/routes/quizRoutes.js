const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { submitQuizAttempt } = require("../controllers/quizController");

// POST - Create quiz
router.post('/', quizController.createQuiz);

// GET - All quizzes under a topic
router.get('/topic/:topicId', quizController.getQuizzesByTopic);

// GET - Single quiz
router.get('/:id', quizController.getQuizById);

// PUT - Update quiz
router.put('/:id', quizController.updateQuiz);


// DELETE - Delete quiz
router.delete('/:id', quizController.deleteQuiz);


router.post("/quiz-attempts", submitQuizAttempt);

module.exports = router;