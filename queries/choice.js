let pool = require('../helper/db_connection.js');

exports.getChoices = () => {
    return pool.query('SELECT * FROM choices');
};

exports.getChoiceById = id => {
    return pool.query('SELECT * FROM choices WHERE id = ?', [id]);
};

exports.addChoice = (choice) => {
    return pool.query('INSERT INTO choices SET ? ', choice);
};

exports.updateChoice = (choice) => {
    return pool.query('UPDATE choices SET ? WHERE id = ?', [choice, choice.id]);
};

exports.deleteChoice = (id) => {
    return pool.query('DELETE FROM choices WHERE id = ?', [id]);
};

//*******************************************//
exports.getChoicesForQuestion = questionId => {
    return pool.query('SELECT * FROM choices WHERE question =  ?', [questionId]);
};