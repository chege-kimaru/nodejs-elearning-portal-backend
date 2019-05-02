let pool = require('../helper/db_connection.js');

module.exports.initialize = function () {
    //Create users table
    // pool.query('ALTER TABLE user_quizes ADD title VARCHAR(700) NOT NULL ');
    pool.query('CREATE TABLE IF NOT EXISTS users (' +
        'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
        'firstName VARCHAR(50) NOT NULL, ' +
        'middleName VARCHAR(50), ' +
        'lastName VARCHAR(50) NOT NULL, ' +
        'idNumber VARCHAR(50) NOT NULL, ' +
        'email VARCHAR(50) NOT NULL UNIQUE, ' +
        'phoneNumber VARCHAR(10) NOT NULL, ' +
        'address VARCHAR(50), ' +
        'addressCode VARCHAR(50), ' +
        'city VARCHAR(50), ' +
        'role INT NOT NULL DEFAULT 3, ' +
        'password VARCHAR(255) NOT NULL, ' +
        'imageUrl VARCHAR(500), ' +
        'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
        'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ' +
        ')')
        .then(resolve => {
            pool.query('CREATE TABLE IF NOT EXISTS courses (' +
                'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
                'name VARCHAR(255) NOT NULL, ' +
                'instructor INT NOT NULL, ' +
                'verified INT NOT NULL DEFAULT 0, ' +
                'shown INT NOT NULL DEFAULT 0, ' +
                'imageUrl VARCHAR(500), ' +
                'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
                'FOREIGN KEY(instructor) REFERENCES users(id)' +
                ')');
        })
        .then(resolve => {
            pool.query('CREATE TABLE IF NOT EXISTS topics (' +
                'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
                'topicNo INT NOT NULL UNIQUE, ' +
                'title VARCHAR(255) NOT NULL, ' +
                'content TEXT NOT NULL, ' +
                'course INT NOT NULL, ' +
                'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
                'FOREIGN KEY(course) REFERENCES courses(id)' +
                ')');
        })
        .then(resolve => {
            pool.query('CREATE TABLE IF NOT EXISTS quizes (' +
                'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
                'title VARCHAR(700) NOT NULL,' +
                'topic INT NOT NULL,' +
                'shown INT NOT NULL DEFAULT 0, ' +
                'must INT NOT NULL DEFAULT 0, ' +
                'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
                'FOREIGN KEY(topic) REFERENCES topics(id)' +
                ')');
        })
        .then(resolve => {
            pool.query('CREATE TABLE IF NOT EXISTS questions (' +
                'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
                'content VARCHAR(1000), ' +
                'quiz INT NOT NULL, ' +
                'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
                'FOREIGN KEY(quiz) REFERENCES quizes(id)' +
                ')');
        })
        .then(resolve => {
            pool.query('CREATE TABLE IF NOT EXISTS choices (' +
                'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
                'content VARCHAR(1000), ' +
                'question INT NOT NULL, ' +
                'isAnswer INT NOT NULL DEFAULT 0, ' +
                'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
                'FOREIGN KEY(question) REFERENCES questions(id)' +
                ')');
        })
        .then(resolve => {
            pool.query('CREATE TABLE IF NOT EXISTS user_courses (' +
                'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
                'user INT NOT NULL, ' +
                'course INT NOT NULL, ' +
                'isComplete INT NOT NULL DEFAULT 0, ' +
                'marks INT, ' +
                'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
                'UNIQUE(user, course), ' +
                'FOREIGN KEY(user) REFERENCES users(id), ' +
                'FOREIGN KEY(course) REFERENCES courses(id)' +
                ')');
        })
        .then(resolve => {
            pool.query('CREATE TABLE IF NOT EXISTS user_topics (' +
                'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
                'user INT NOT NULL, ' +
                'topic INT NOT NULL, ' +
                'isComplete INT NOT NULL DEFAULT 0, ' +
                'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
                'UNIQUE(user, topic), ' +
                'FOREIGN KEY(user) REFERENCES users(id), ' +
                'FOREIGN KEY(topic) REFERENCES topics(id)' +
                ')');
        })
        .then(resolve => {
            pool.query('CREATE TABLE IF NOT EXISTS user_quizes (' +
                'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
                'user INT NOT NULL, ' +
                'quiz INT NOT NULL, ' +
                'marks INT, ' +
                'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
                'UNIQUE(user, quiz), ' +
                'FOREIGN KEY(user) REFERENCES users(id), ' +
                'FOREIGN KEY(quiz) REFERENCES quizes(id)' +
                ')');
        })
        .then(resolve => {
            pool.query('CREATE TABLE IF NOT EXISTS user_questions (' +
                'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
                'user INT NOT NULL, ' +
                'question INT NOT NULL, ' +
                'choice INT NOT NULL, ' +
                'correct INT NOT NULL, ' +
                'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
                'UNIQUE(user, question), ' +
                'FOREIGN KEY(user) REFERENCES users(id), ' +
                'FOREIGN KEY(question) REFERENCES questions(id), ' +
                'FOREIGN KEY(choice) REFERENCES choices(id)' +
                ')');
        })
        .then(resolve => {
            pool.query('CREATE TABLE IF NOT EXISTS instructor_requests (' +
                'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
                'user INT NOT NULL, ' +
                'topic VARCHAR(300) NOT NULL, ' +
                'details TEXT NULL, ' +
                'received INT NOT NULL DEFAULT 0, ' +
                'accepted INT NOT NULL DEFAULT 0, ' +
                'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
                'FOREIGN KEY(user) REFERENCES users(id)'+
                ')');
        })
        .then(resolve => {
            pool.query('CREATE TABLE IF NOT EXISTS notifications (' +
                'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
                'user INT NOT NULL, ' +
                'topic VARCHAR(300) NOT NULL, ' +
                'details TEXT NULL, ' +
                'viewed INT NOT NULL DEFAULT 0, ' +
                'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
                'FOREIGN KEY(user) REFERENCES users(id)'+
                ')');
        })
        .then(resolve => {
            pool.query('CREATE TABLE IF NOT EXISTS chats (' +
                'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
                'user INT NOT NULL, ' +
                'course INT NOT NULL, ' +
                'message TEXT NOT NULL, ' +
                'username VARCHAR(50) NOT NULL, ' +
                'dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
                'lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
                'FOREIGN KEY(user) REFERENCES users(id), '+
                'FOREIGN KEY(course) REFERENCES courses(id)'+
                ')');
        });


};