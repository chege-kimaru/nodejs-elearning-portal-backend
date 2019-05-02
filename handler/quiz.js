const dbQuiz = require('../queries/quiz');
const dbTopic = require('../queries/topic');
const dbCourse = require('../queries/course');
const AuthorizationError = require('../errors/AuthorizationError');

exports.addQuiz = (quiz, userId) => {
    return new Promise(async resolve => {
        const topic = await dbTopic.getTopicById(quiz.topic);
        const course = await dbCourse.getCourseById(topic[0].course);
        if (course[0].instructor != userId) throw new AuthorizationError('Unauthorized');
        const addChoice = await dbQuiz.addQuiz(quiz);
        resolve();
    });
};

exports.updateQuiz = (quiz, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentQuiz = await dbQuiz.getQuizById(quiz.id);
            const topic = await dbTopic.getTopicById(currentQuiz[0].topic);
            const course = await dbCourse.getCourseById(topic[0].course);
            if (course[0].instructor != userId) throw new AuthorizationError('Unauthorized');
            quiz = {
                "id": quiz.id,
                "title": quiz.title,
                "shown": quiz.shown,
                "must": quiz.must,
            };
            await dbQuiz.updateQuiz(quiz);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
};

exports.deleteQuiz = (quizId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentQuiz = await dbQuiz.getQuizById(quizId);
            const topic = await dbTopic.getTopicById(currentQuiz[0].topic);
            const course = await dbCourse.getCourseById(topic[0].course);
            if (course[0].instructor != userId) throw new AuthorizationError('Unauthorized');
            await dbQuiz.deleteQuiz(quizId);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
};

exports.getQuizes = () => {
    return dbQuiz.getQuizes();
};

exports.getQuizById = (quizId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const quizs = await dbQuiz.getQuizById(quizId);
            let quiz = quizs[0];
            const userQuiz = await dbQuiz.getUserQuiz(quiz.id, userId);
            if (userQuiz[0] && userQuiz[0].id) {
                quiz.completed = 1;
                quiz.marks = userQuiz[0].marks;
            } else {
                quiz.completed = 0;
            }
            const data = await dbQuiz.getQuizQuestionsCount(quiz.id);
            quiz.questionsCount = data[0].questionsCount;
            resolve(quiz);
        } catch (err) {
            reject(err);
        }
    });
};

//***************************************************//
exports.getTopicQuizes = (topicId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let topicQuizes = await dbQuiz.getTopicQuizes(topicId);
            for (let quiz of topicQuizes) {
                const userQuiz = await dbQuiz.getUserQuiz(quiz.id, userId);
                if (userQuiz[0] && userQuiz[0].id) {
                    quiz.completed = 1;
                    quiz.marks = userQuiz[0].marks;
                } else {
                    quiz.completed = 0;
                }
                const data = await dbQuiz.getQuizQuestionsCount(quiz.id);
                quiz.questionsCount = data[0].questionsCount;
            }
            resolve(topicQuizes);
        } catch (err) {
            reject(err);
        }
    });
};

exports.markQuiz = (data) => {
    return dbQuiz.markQuiz(data);
};
