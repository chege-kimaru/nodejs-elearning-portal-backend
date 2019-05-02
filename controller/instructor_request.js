const requestHandler = require('../handler/instructor_request');
const passport = require('passport');

module.exports = (app) => {

    app.put('/requests/confirmRequest', passport.authenticate('jwt', {session: false}),  (req, res) => {
        if(req.user.role != 1) {
            res.status(401);
            res.json('You are not authorized');
            return;
        }
        requestHandler.confirmRequest(req.body)
            .then(resolve => {
                res.status(200);
                res.json({'data': 'Successfully confirmed/rejected request'});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.post('/requests', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role == 1) {
            res.status(200);
            res.json({'data': 'You are an admin. You cannot be an instructor as such.'});
            return;
        }
        if(req.user.role == 2) {
            res.status(200);
            res.json({'data': 'You already are an instructor.'});
            return;
        }

        let data = req.body;
        requestHandler.addRequest(data, req.user.id)
            .then(resolve => {
                res.status(200);
                res.json({'data': 'Successfully made request'});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/requests/:requestId', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 1) {
            res.status(401);
            res.json({'data':'You are not authorized'});
            return;
        }
        requestHandler.getRequestById(req.params.requestId)
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/requests', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 1) {
            res.status(401);
            res.json({'data':'You are not authorized'});
            return;
        }
        requestHandler.getRequests()
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

};