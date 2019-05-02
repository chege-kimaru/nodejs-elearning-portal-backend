let pool = require('../helper/db_connection.js');

exports.addRequest = (request) => {
    return pool.query('INSERT INTO instructor_requests SET ? ', request);
};

//data in the form {accepted: 1, received: 1, id: 1}
exports.confirmRequest = (request) => {
    return pool.query('UPDATE instructor_requests SET ? WHERE id=?', [request, request.id]);
};

exports.getRequests = () => {
    return pool.query('SELECT * FROM instructor_requests ORDER BY received DESC');
};

exports.getRequestById = (requestId) => {
    return pool.query('SELECT * FROM instructor_requests WHERE id= ?', [requestId]);
};