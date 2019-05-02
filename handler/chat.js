const dbChat = require('../queries/chat');
const dbCourse = require('../queries/course');

exports.addChat = (chat) => {
    return new Promise(async (resolve,reject) => {
        try {
            const userCourse = await dbCourse.getUserCourse(chat.course, chat.user);
            const course = await dbCourse.getCourseById(chat.course);
            if((userCourse && userCourse[0]) || course[0].instructor == chat.user) {
                const addChat = await dbChat.addChat(chat);
                const newChat = await dbChat.getChatById(addChat.insertId);
                resolve(newChat[0]);
            } else {
                throw new Error('You are not authorized to chat in this group. Please register for the course first');
            }
        }catch(err) {
            reject(err);
        }
    });
};

exports.getChatsForCourse = (courseId) => {
    return dbChat.getChatsForCourse(courseId);
};

