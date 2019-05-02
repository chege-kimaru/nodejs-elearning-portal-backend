const mysql = require('promise-mysql');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
    connectionLimit: 10
});



pool.getConnection((err, conn) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('Connected to mysql database.');
});

module.exports = pool;