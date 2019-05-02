const choiceHandler = require('../handler/choice');
const passport = require('passport');

module.exports = (app) => {

    app.get('/choices/getChoicesForQuestion/:questionId', passport.authenticate('jwt', {session: false}), (req, res) => {
        choiceHandler.getChoicesForQuestion(req.params.questionId)
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    //****************************************//

    app.post('/choices', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 2) {
            res.status(401);
            res.json({'error': 'Anauthorized'});
            return;
        }
        choiceHandler.addChoice(req.body, req.user.id)
            .then(resolve => {
                res.status(201);
                res.json({'data': 'Successfully added choice'});
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

    app.put('/choices', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 2) {
            res.status(401);
            res.json({'error': 'Anauthorized'});
            return;
        }
        choiceHandler.updateChoice(req.body, req.user.id)
            .then(resolve => {
                res.status(200);
                res.json({'data': 'Successfully updated choice'});
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

    app.delete('/choices/:id',passport.authenticate('jwt', {session: false}),  (req, res) => {
        if(req.user.role != 2) {
            res.status(401);
            res.json({'error': 'Anauthorized'});
            return;
        }
        choiceHandler.deleteChoice(req.params.id, req.user.id)
            .then(resolve => {
                res.status(200);
                res.json({"data":"Successfully deleted choice"});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/choices', (req, res) => {
        choiceHandler.getChoices()
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/choices/:id', (req, res) => {
        choiceHandler.getChoiceById(req.params.id)
            .then(data => {
                res.status(200);
                res.json(data[0]);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

};