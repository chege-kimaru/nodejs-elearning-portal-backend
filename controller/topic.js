const topicHandler = require('../handler/topic');
const passport = require('passport');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (app) => {

    app.post('/topics/setTopicCompleted/:topicId', passport.authenticate('jwt', {session: false}), (req, res) => {
        topicHandler.setTopicComplete(req.params.topicId, req.user.id)
            .then(resolve => {
                res.status(200);
                res.json({'data': 'Successfully marked topic as complete'});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/topics/getCourseTopics/:courseId', passport.authenticate('jwt', {session: false}), (req, res) => {
        topicHandler.getCourseTopics(req.params.courseId)
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    //*******************************************************************

    app.post('/topics', passport.authenticate('jwt', {session: false}), (req, res) => {
        topicHandler.addTopic(req.body, req.user.id)
            .then(resolve => {
                res.status(201);
                res.json({'data': 'Successfully added topic'});
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

    app.put('/topics', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 2) {
            res.status(401);
            res.json({'error': 'Anauthorized'});
            return;
        }

        topicHandler.updateTopic(req.body, req.user.id)
            .then(resolve => {
                res.status(200);
                res.json({'data': 'Successfully updated topic'});
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

    app.delete('/topics/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 2) {
            res.status(401);
            res.json({'Error':"Unauthorized"});
        }
        topicHandler.deleteTopic(req.params.id, req.user.id)
            .then(resolve => {
                res.status(200);
                res.json({"data": "Successfully deleted topic"});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/topics', (req, res) => {
        topicHandler.getTopics()
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/topics/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
        topicHandler.getTopicById(req.params.id)
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

};