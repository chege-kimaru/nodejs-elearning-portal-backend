const dbRequest = require('../queries/instructor_request');
const dbNotification = require('../queries/notification');
const dbUser = require('../queries/user');

exports.addRequest = (request, userId) => {
    request.user = userId;
    return dbRequest.addRequest(request);
};

exports.getRequests = () => {
    return new Promise(async resolve => {
        let requests = await  dbRequest.getRequests();
        for (let request of requests) {
            let user = await dbUser.getUserById(request.user);
            request.user = user[0];
        }
        resolve(requests);
    });
};

exports.getRequestById = (requestId) => {
    return new Promise(async resolve => {
        const requests = await  dbRequest.getRequestById(requestId);
        let request = requests[0];
        let user = await dbUser.getUserById(request.user);
        request.user = user[0];
        resolve(request);
    });
};

exports.confirmRequest = (request) => {
    return new Promise(async resolve => {
        request.received = 1;
        const confirmRequest = await dbRequest.confirmRequest(request);
        const confirmedRequests = await dbRequest.getRequestById(request.id);
        const confirmedRequest = confirmedRequests[0];
        let user = await {
            'id': confirmedRequest.user
        };
        let notification = await {
            'user': confirmedRequest.user,
                'topic': 'Request to be an instructor.'
        };
        if(request.accepted == 1) {
            user.role = 2;
            notification.details = 'Congratulations. ' +
                'Your request to become an instructor has been received and confirmed. ' +
                'You can now create courses as you wish on the subject. ' +
                'This courses must however be confirmed before people can enroll.';
        } else {
            user.role = 3;
            notification.details = 'We are dissapointed to inform you that the request to become an instructor has been rejected. ' +
                'This might be because of several reasons including that your area of speciality is already occupied.'
        }
        const instructor = await dbUser.updateUser(user);
        const sendNotification = await dbNotification.addNotification(notification);
        resolve();
    });
};