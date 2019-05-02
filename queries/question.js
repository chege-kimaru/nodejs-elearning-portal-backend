let pool = require('../helper/db_connection.js');

exports.getQuestions = () => {
    return pool.query('SELECT * FROM questions');
};

exports.getQuestionById = id => {
    return pool.query('SELECT * FROM questions WHERE id = ?', [id]);
};

exports.addQuestion = (question) => {
    return pool.query('INSERT INTO questions SET ? ', question);
};

exports.updateQuestion = (question) => {
    return pool.query('UPDATE questions SET ? WHERE id = ?', [question, question.id]);
};

exports.deleteQuestion = (id) => {
    return pool.query('DELETE FROM questions WHERE id = ?', [id]);
};

//*****************************************//
exports.getQuestionsForQuiz = quizId => {
    return pool.query('SELECT * FROM questions WHERE quiz =  ?', [quizId]);
};

exports.getUserQuestion = (questionId, userId) => {
    return pool.query("SELECT * FROM user_questions WHERE question = ? AND user = ? ", [questionId, userId]);
};