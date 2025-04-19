const data = require('../data');

exports.getAllQuizzes = (req, res) => {
    const { category } = req.query;
    const result = category
        ? data.quizzes.filter(q => q.category === category)
        : data.quizzes;
    res.json(result);
};

exports.getQuestions = (req, res) => {
    console.log("check", req.params)
    const quiz = data.quizzes.find(q => q.id === req.params.quiz_id);
    if (!quiz) return res.status(404).send('Quiz not found');
    res.json(quiz.questions); // Simplified
};

exports.submitAnswer = (req, res) => {
    const quiz = data.quizzes.find(q => q.id === req.params.quiz_id);
    if (!quiz) return res.status(404).send('Quiz not found');
    // TODO: answer is correct or not
    // based on that send feedback to user

    const randomNumber = Math.floor(Math.random() * 11);
    let feedback = "FEEDBACK: Well done you are doing good \n ///////////////////////////// -Feedback ended- /////////////////////////////////////"

    if (randomNumber % 2 !== 0) {
        feedback = "FEEDBACK: Your answer is wrong \n ///////////////////////////// -Feedback ended- /////////////////////////////////////"
    }

    quiz.answers.push({...req.body, correctAnswer: randomNumber % 2 === 0 ? true : false});
    res.send({
        correctAnswer: randomNumber % 2 === 0 ? true : false,
        feedback
    });
};

exports.getQuizData = (req, res) => {
    const quiz = data.quizzes.find(q => q.id === req.params.quiz_id);
    if (!quiz) return res.status(404).send('Quiz not found');
    res.json({ response: quiz.response });
};

exports.getSuggestions = (req, res) => {
    const query = req.query.q;
    const quiz = data.quizzes.find(q => q.id === req.params.quiz_id);
    if (!quiz) return res.status(404).send('Quiz not found');
    res.json(quiz.suggestions.filter((_suggestion) => _suggestion.command.toLowerCase().includes(query.toLowerCase())));
};


exports.getQuizAnalysis = (req, res) => {
    const quiz = data.quizzes.find(q => q.id === req.params.quiz_id);
    if (!quiz) return res.status(404).send('Quiz not found');
    const questions = quiz.questions;
    const answers = quiz.answers;

    questions.map((_question, index) => {
        let currentQuestionIndexAnser = answers[index];

        if(currentQuestionIndexAnser.questionId === _question.id){
            return ({..._question, ...currentQuestionIndexAnser})
        }else{
            _question;
        }
    })

    res.json(questions);

}
