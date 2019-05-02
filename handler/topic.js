const dbTopic = require('../queries/topic');
const dbQuiz = require('../queries/quiz');
const dbCourse = require('../queries/course');
const dbNotification = require('../queries/notification');
const AuthorizationError = require('../errors/AuthorizationError');

exports.addTopic = (topic, userId) => {
    return new Promise(async resolve => {
        const course = await dbCourse.getCourseById(topic.course);
        if (course[0].instructor != userId) {
            throw new AuthorizationError('Unauthorized');
        } else {
            const addTopic = await dbTopic.addTopic(topic);
            resolve();
        }
    });
};

exports.updateTopic = (topic, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentTopic = await dbTopic.getTopicById(topic.id);
            const course = await dbCourse.getCourseById(currentTopic[0].course);
            if (course[0].instructor != userId) {
                throw new AuthorizationError('Unauthorized');
            } else {
                topic = {
                    "id": topic.id,
                    "topicNo": topic.topicNo,
                    "title": topic.title,
                    "content": topic.content
                };
                await dbTopic.updateTopic(topic);
                resolve();
            }
        } catch (err) {
            reject(err);
        }
    });
};

exports.deleteTopic = (topicId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentTopic = await dbTopic.getTopicById(topicId);
            const course = await dbCourse.getCourseById(currentTopic[0].course);
            if (course[0].instructor != userId) {
                throw new AuthorizationError('Unauthorized');
            } else {
                await dbTopic.deleteTopic(topicId);
                resolve();
            }
        } catch (err) {
            reject(err);
        }
    });
};

exports.getTopics = () => {
    return dbTopic.getTopics();
};

exports.getTopicById = (topicId, userId) => {
    return dbTopic.getTopicById(topicId)
        .then(async topics => {
            let topic = topics[0];
            if (topic) {
                let topicQuizes = await dbQuiz.getTopicQuizes(topic.id);
                topic.requireQuiz = 0;
                for (let quiz of topicQuizes)
                    if (quiz.must) {
                        topic.requireQuiz = 1;
                        break;
                    }

                // dbTopic.getUserCourseTopic(topicId, userId).then(userTopics => {
                //     let userTopic = userTopics[0];
                //     topic.completed = userTopic && userTopic.isComplete;
                //
                //     return new Promise(resolve => resolve(topic));
                // })
                let userTopics = await dbTopic.getUserCourseTopic(topicId, userId);
                const userTopic = userTopics[0];
                topic.completed = userTopic && userTopic.isComplete;
            }
            return new Promise(resolve => resolve(topic));
        });
};

//***********************************************************//
exports.getCourseTopics = (courseId) => {
    return dbTopic.getCourseTopics(courseId);
};

exports.setTopicComplete = (topicId, userId) => {
    //TODO: ENSURE USER HAS SUBSRIBED TO THIS COURSE
    return new Promise(async (resolve, reject) => {
        try {
            const currentTopics = await dbTopic.getTopicById(topicId);
            const currentCourses = await dbCourse.getCourseById(currentTopics[0].course);

            const userTopics = await dbTopic.getUserTopic(userId, topicId);
            if (!userTopics[0]) {
                const userTopic = {user: userId, topic: topicId, isComplete: 1};
                const addUserTopic = await dbTopic.addUserTopic(userTopic);
            } else {
                const userTopic = {user: userId, topic: topicId, isComplete: 1};
                const updateUserTopic = await dbTopic.updateUserTopic(userTopic);
            }
            const topicCompleteNotification = {
                user: userId,
                topic: 'Topic Completion',
                details: `Congratulations on completing TOPIC: 
                ${currentTopics[0].title} of COURSE: ${currentCourses[0].name}`
            };
            await dbNotification.addNotification(topicCompleteNotification);

            resolve();
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
};
