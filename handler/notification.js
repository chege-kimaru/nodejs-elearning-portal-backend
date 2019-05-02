const dbNotification= require('../queries/notification');
const AuthorizationError= require('../errors/AuthorizationError');

exports.getUserNotifications = (userId) => {
    return dbNotification.getUserNotifications(userId);
};

exports.setViewed = (data, userId) => {
    return new Promise(async resolve => {
        // const notification = await dbNotification.getNotificationById(data.id);
        // if(notification.user != userId) throw new AuthorizationError("Unauthorized");
        // let newNotification = {
        //     'id': data.id,
        //     'viewed': 1
        // };
        const viewedNotification = await dbNotification.updateNotification({'id':data.id, 'viewed': 1});
        resolve();
    });
};