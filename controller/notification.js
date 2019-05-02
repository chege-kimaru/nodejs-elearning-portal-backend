const notificationHandler = require('../handler/notification');
const passport = require('passport');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (app) => {

    app.get('/notifications/getUserNotifications', passport.authenticate('jwt', {session: false}), (req, res) => {
        notificationHandler.getUserNotifications(req.user.id)
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.put('/notifications/setViewed', passport.authenticate('jwt', {session: false}), (req, res) => {
        notificationHandler.setViewed(req.body, req.user.id)
            .then(resolve => {
                res.status(200);
                res.json({'data': 'Successfully updated as viewed.'});
            }).catch(err => {
            if (err instanceof AuthorizationError) {
                res.status(401);
                res.json({'error': err.message})
            } else {
                res.status(500);
                res.json({'error': err.message})
            }
        });
    });

};