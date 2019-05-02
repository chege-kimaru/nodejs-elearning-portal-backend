const userHandler = require('../handler/user');
const AuthorizationError = require('../errors/AuthorizationError');
const passport = require('passport');

module.exports = (app) => {

    app.get('/users/instructors',passport.authenticate('jwt', {session: false}), (req, res) => {
        userHandler.getInstructors()
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/users/getLoggedInUser',passport.authenticate('jwt', {session: false}), (req, res) => {
        res.json(req.user);
    });

    app.post('/auth/login', (req, res) => {
        userHandler.login(req.body.email, req.body.password).then(user => {
            res.status(200);
            res.json(user);
        }).catch(err => {
            if(err instanceof AuthorizationError) {
                res.status(401);
            } else {
                res.status(500);
            }
            res.json({'error': err.message})
        });
    });

    //******************************************************//

    app.post('/users', (req, res) => {
        userHandler.addUser(req.body)
            .then(resolve => {
                res.status(201);
                res.json({'data': 'Successfully registered User'});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.put('/users', (req, res) => {
        userHandler.updateUser(req.body)
            .then(resolve => {
                res.status(200);
                res.json({'data': 'Successfully updated User'});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.delete('/users/:id', (req, res) => {
        userHandler.deleteUser(req.params.id)
            .then(resolve => {
                res.status(200);
                res.json({"data": "Successfully deleted user"});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/users',passport.authenticate('jwt', {session: false}), (req, res) => {
        userHandler.getUsers()
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/users/:id', (req, res) => {
        userHandler.getUserById(req.params.id)
            .then(data => {
                res.status(200);
                res.json(data[0]);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    //***************************************************************//

};