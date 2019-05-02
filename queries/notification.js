let pool = require('../helper/db_connection.js');

exports.addNotification = (notification) => {
    return pool.query('INSERT INTO notifications SET ? ', notification);
};

exports.getUserNotifications = (userId) => {
    return pool.query('SELECT * FROM notifications WHERE user = ? ORDER BY dateAdded DESC', [userId]);
};

exports.getNotificationById = (notificationId) => {
    return pool.query('SELECT * FROM notifications WHERE id = ?', [notificationId]);
};

exports.updateNotification = (notification) => {
    return pool.query('UPDATE notifications set ? WHERE id = ?', [notification, notification.id]);
};