let pool = require('../helper/db_connection.js');

exports.getTopics = () => {
    return pool.query('SELECT * FROM topics');
};

exports.getTopicById = id => {
    return pool.query('SELECT * FROM topics WHERE id = ?', [id]);
};

exports.addTopic = (topic) => {
    return pool.query('INSERT INTO topics SET ? ', topic);
};

exports.updateTopic = (topic) => {
    return pool.query('UPDATE topics SET ? WHERE id = ?', [topic, topic.id]);
};

exports.deleteTopic = (id) => {
    return pool.query('DELETE FROM topics WHERE id = ?', [id]);
};

//*************************************************************************//
exports.getCourseTopics = (courseId) => {
    return pool.query('SELECT * FROM topics WHERE course = ?', [courseId]);
};

exports.getUserCourseTopic = (topicId, userId) => {
    return pool.query('SELECT * FROM user_topics WHERE topic = ? AND user = ?', [topicId, userId]);
};

exports.getUserTopic = (userId, topicId) => {
   return  pool.query("SELECT * FROM user_topics WHERE user = ? AND topic =?", [userId, topicId]);
};

exports.addUserTopic = (userTopic) => {
    return pool.query("INSERT INTO user_topics SET ?", userTopic);
};

exports.updateUserTopic = (userTopic) => {
    return connection.query("UPDATE user_topics SET isComplete = ? WHERE user=? AND topic=?", [userTopic]);
};

