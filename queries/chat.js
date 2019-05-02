let pool = require('../helper/db_connection.js');

exports.getChatsForCourse = (courseId) => {
    return pool.query('SELECT * FROM chats WHERE course = ?', [courseId]);
};

exports.addChat = (chat) => {
    return pool.query('INSERT INTO chats SET ? ', chat);
};

exports.getChatById = (chatId) => {
    return pool.query('SELECT * FROM chats WHERE id = ?', [chatId])
};