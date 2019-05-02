const questionHandler = require('../handler/question');
const passport = require('passport');

module.exports = (app) => {

    app.get('/questions/getQuestionsForQuiz/:quizId', passport.authenticate('jwt', {session: false}), (req, res) => {
        questionHandler.getQuestionsForQuiz(req.params.quizId, req.user.id)
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    //*********************************************//

    app.post('/questions',passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 2) {
            res.status(401);
            res.json({'error': 'Anauthorized'});
            return;
        }
        questionHandler.addQuestion(req.body, req.user.id)
            .then(resolve => {
                res.status(201);
                res.json({'data': 'Successfully added question'});
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

    app.put('/questions', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 2) {
            res.status(401);
            res.json({'error': 'Anauthorized'});
            return;
        }
        questionHandler.updateQuestion(req.body, req.user.id)
            .then(resolve => {
                res.status(200);
                res.json({'data': 'Successfully updated question'});
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

    app.delete('/questions/:id',  passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 2) {
            res.status(401);
            res.json({'error': 'Anauthorized'});
            return;
        }
        questionHandler.deleteQuestion(req.params.id, req.user.id)
            .then(resolve => {
                res.status(200);
                res.json({"data": "Successfully deleted question"});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/questions', (req, res) => {
        questionHandler.getQuestions()
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/questions/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
        questionHandler.getQuestionById(req.params.id)
            .then(data => {
                res.status(200);
                res.json(data[0]);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

};