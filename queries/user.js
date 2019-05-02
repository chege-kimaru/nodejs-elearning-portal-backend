let pool = require('../helper/db_connection.js');

exports.getUsers = () => {
    return pool.query('SELECT * FROM users');
};

exports.getUserById = id => {
    return pool.query('SELECT * FROM users WHERE id = ?', [id]);
};

exports.addUser = (user) => {
    return pool.query('INSERT INTO users SET ? ', user);
};

exports.updateUser = (user) => {
    return pool.query('UPDATE users SET ? WHERE id = ?', [user, user.id]);
};

exports.deleteUser = (id) => {
    return pool.query('DELETE FROM users WHERE id = ?', [id]);
};


//***************************************************************//
exports.getUserByEmail = email => {
    return pool.query('SELECT * FROM users WHERE email = ?', [email]);
};

exports.getInstructors = () => {
    return pool.query('SELECT * FROM users WHERE role = 2');
};