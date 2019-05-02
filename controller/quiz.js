const quizHandler = require('../handler/quiz');
const passport = require('passport');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (app) => {

    app.post('/quizes/markQuiz', passport.authenticate('jwt', {session: false}), (req, res) => {
        let data = req.body;
        data.user = req.user.id;
        quizHandler.markQuiz(data)
            .then(resolve => {
                res.status(200);
                res.json({'data': 'Successfully marked quiz'});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/quizes/getTopicQuizes/:topicId', passport.authenticate('jwt', {session: false}), (req, res) => {
        quizHandler.getTopicQuizes(req.params.topicId, req.user.id)
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    //*******************************************************//

    app.post('/quizes', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 2) {
            res.status(401);
            res.json({'error': 'Unauthorized'});
            return;
        }
        quizHandler.addQuiz(req.body, req.user.id)
            .then(resolve => {
                res.status(201);
                res.json({'data': 'Successfully added quiz'});
            }).catch(err => {
            if (err instanceof AuthorizationError) {
                res.status(401);
                res.json({'error': err.message});
            } else {
                res.status(500);
                res.json({'error': err.message})
            }
        });
    });

    app.put('/quizes',passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 2) {
            res.status(401);
            res.json({'error': 'Unauthorized'});
            return;
        }
        quizHandler.updateQuiz(req.body, req.user.id)
            .then(resolve => {
                res.status(200);
                res.json({'data': 'Successfully updated quiz'});
            }).catch(err => {
            if (err instanceof AuthorizationError) {
                res.status(401);
                res.json({'error': err.message});
            } else {
                res.status(500);
                res.json({'error': err.message})
            }
        });
    });

    app.delete('/quizes/:id',  passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 2) {
            res.status(401);
            res.json({'Error':"Unauthorized"});
        }
        quizHandler.deleteQuiz(req.params.id, req.user.id)
            .then(resolve => {
                res.status(200);
                res.json({"data": "Successfully deleted quiz"});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/quizes', (req, res) => {
        quizHandler.getQuizes()
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/quizes/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
        quizHandler.getQuizById(req.params.id, req.user.id)
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

};