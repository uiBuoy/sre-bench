const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/', quizController.getAllQuizzes);
router.get('/:quiz_id/questions', quizController.getQuestions);
router.post('/:quiz_id/answer/:questionId', quizController.submitAnswer);
router.get('/:quiz_id/data', quizController.getQuizData);
router.get('/:quiz_id/auto-suggestions', quizController.getSuggestions);
router.get('/:quiz_id/quiz-analysis', quizController.getQuizAnalysis);


module.exports = router;