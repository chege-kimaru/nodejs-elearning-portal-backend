let pool = require('../helper/db_connection.js');

exports.getCourses = () => {
    return pool.query('SELECT * FROM courses');
};

exports.getCourseById = id => {
    return pool.query('SELECT c.*, CONCAT(u.firstName, " ", u.middleName, " ", u.lastName) AS instructorName, COUNT(uc.id) AS registered ' +
        'FROM courses c ' +
        'LEFT JOIN users u ' +
        'ON c.instructor = u.id ' +
        'LEFT JOIN user_courses uc ' +
        'ON c.id = uc.course ' +
        'WHERE c.id = ?', [id]);
};

exports.addCourse = (course) => {
    return pool.query('INSERT INTO courses SET ? ', course);
};

exports.updateCourse = (course) => {
    return pool.query('UPDATE courses SET ? WHERE id = ?', [course, course.id]);
};

exports.deleteCourse = (id) => {
    return pool.query('DELETE FROM courses WHERE id = ?', [id]);
};

exports.getVerifiedAndShownCourses = () => {
    return pool.query('SELECT c.*, CONCAT(u.firstName, " ", u.middleName, " ", u.lastName) AS instructorName ' +
        'FROM courses c ' +
        'LEFT JOIN users u ' +
        'ON c.instructor = u.id ' +
        'WHERE verified = 1 AND shown = 1 ' +
        'ORDER BY dateAdded DESC');
};

//******************************************************//
exports.addUserCourse = (userCourse) => {
    return pool.query('INSERT INTO user_courses SET ? ', userCourse);
};

exports.getUserCompleteCourses = (userId) => {
    return pool.query('SELECT * FROM user_courses WHERE user = ? AND isComplete = 1 ORDER BY dateAdded DESC', [userId]);
};

exports.getUserIncompleteCourses = (userId) => {
    return pool.query('SELECT * FROM user_courses WHERE user = ? AND isComplete = 0 ORDER BY dateAdded DESC', [userId]);
};

exports.getUserCourse = (courseId, userId) => {
    return pool.query('SELECT * FROM user_courses WHERE course = ? AND user = ?', [courseId, userId]);
};

exports.getInstructorCourses = (instructorId) => {
    return pool.query('SELECT * FROM courses WHERE instructor = ? ORDER BY dateAdded DESC', [instructorId]);
};

exports.countUserTopicsForCourse = (courseId, userId) => {
    return pool.query("SELECT COUNT(ut.id) AS userTopicsCount FROM user_topics ut, courses c, topics t " +
        "WHERE ut.topic = t.id AND t.course = c.id");
};

exports.countTopicsForCourse = (courseId) => {
    return pool.query("SELECT COUNT(t.id) AS topicsCount FROM courses c, topics t " +
        "WHERE t.course = c.id");
};