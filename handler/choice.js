const dbChoice = require('../queries/choice');
const dbQuestion = require('../queries/question');
const dbQuiz = require('../queries/quiz');
const dbTopic = require('../queries/topic');
const dbCourse = require('../queries/course');
const AuthorizationError = require('../errors/AuthorizationError');

exports.addChoice = (choice, userId) => {
    return new Promise(async resolve => {
        const question = await dbQuestion.getQuestionById(choice.question);
        const quiz = await dbQuiz.getQuizById(question[0].quiz);
        const topic = await dbTopic.getTopicById(quiz[0].topic);
        const course = await dbCourse.getCourseById(topic[0].course);
        if (course[0].instructor != userId) throw new AuthorizationError('Unauthorized');
        const addChoice = await dbChoice.addChoice(choice);
        resolve();
    });
};

exports.updateChoice = (choice, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentChoice = await dbChoice.getChoiceById(choice.id);
            const question = await dbQuestion.getQuestionById(currentChoice[0].question);
            const quiz = await dbQuiz.getQuizById(question[0].quiz);
            const topic = await dbTopic.getTopicById(quiz[0].topic);
            const course = await dbCourse.getCourseById(topic[0].course);
            if (course[0].instructor != userId) throw new AuthorizationError('Unauthorized');

            choice = {
                "id": choice.id,
                "content": choice.content,
                "isAnswer": choice.isAnswer
            };
            await dbChoice.updateChoice(choice);
            resolve();
        }catch(err) {
            reject(err);
        }
    });
};

exports.deleteChoice = (choiceId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentChoice = await dbChoice.getChoiceById(choiceId);
            const question = await dbQuestion.getQuestionById(currentChoice[0].question);
            const quiz = await dbQuiz.getQuizById(question[0].quiz);
            const topic = await dbTopic.getTopicById(quiz[0].topic);
            const course = await dbCourse.getCourseById(topic[0].course);
            if (course[0].instructor != userId) throw new AuthorizationError('Unauthorized');

            await dbChoice.deleteChoice(choiceId);
            resolve();
        }catch(err) {
            reject(err);
        }
    });
};

exports.getChoices = () => {
    return dbChoice.getChoices();
};

exports.getChoiceById = id => {
    return dbChoice.getChoiceById(id);
};

//******************************************//
exports.getChoicesForQuestion = (questionId) => {
    return dbChoice.getChoicesForQuestion(questionId);
};