const dbQuestion = require('../queries/question');
const dbChoice = require('../queries/choice');
const dbQuiz = require('../queries/quiz');
const dbTopic = require('../queries/topic');
const dbCourse = require('../queries/course');
const AuthorizationError = require('../errors/AuthorizationError');

exports.addQuestion = (question, userId) => {
    return new Promise(async resolve => {
        const quiz = await dbQuiz.getQuizById(question.quiz);
        const topic = await dbTopic.getTopicById(quiz[0].topic);
        const course = await dbCourse.getCourseById(topic[0].course);
        if(course[0].instructor != userId) throw new AuthorizationError('Unauthorized');
        const addChoice = await dbQuestion.addQuestion(question);
        resolve();
    });
};

//TODO: right procedure for updating and deleting question
exports.updateQuestion = (question) => {
    question = {
        "id": question.id,
        "content": question.content
    };
    return dbQuestion.updateQuestion(question);
};

exports.deleteQuestion = (questionId, userId) => {
    return dbQuestion.deleteQuestion(questionId);
};


exports.getQuestions = () => {
    return dbQuestion.getQuestions();
};

exports.getQuestionById = id => {
    return dbQuestion.getQuestionById(id);
};

//****************************************************//
exports.getQuestionsForQuiz = async (quizId, userId) => {
    let questions = await dbQuestion.getQuestionsForQuiz(quizId);

    for(let question of questions) {
        question.choices = [];
        let choices = await dbChoice.getChoicesForQuestion(question.id);
        let userQuestion = await dbQuestion.getUserQuestion(question.id, userId);
        question.userSelected = 0;
        question.userCorrect = 0;
        if(userQuestion[0]) {
            question.userSelected = userQuestion[0].choice;
            question.userCorrect = userQuestion[0].correct;
        }

        for (const choice of choices) {
            question.choices.push(choice);
        }

    }
    return new Promise(resolve => resolve(questions));
};
