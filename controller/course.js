const courseHandler = require('../handler/course');
const passport = require('passport');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (app) => {

    app.put('/courses/activateCourse', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 1) {
            res.status(401);
            res.json({'Error':"Unauthorized"});
        }
        courseHandler.activateCourse(req.body)
            .then(resolve => {
                res.status(200);
                res.json({'data': 'Successfully activated course'});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.put('/courses/suspendCourse', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 1) {
            res.status(401);
            res.json({'Error':"Unauthorized"});
        }
        courseHandler.suspendCourse(req.body)
            .then(resolve => {
                res.status(200);
                res.json({'data': 'Successfully suspended course'});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });


    app.get('/courses/getInstructorCourses/:instructorId', passport.authenticate('jwt', {session: false}), (req, res) => {
        courseHandler.getInstructorCourses(req.params.instructorId)
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/courses/getUserDisplayCourses', passport.authenticate('jwt', {session: false}), (req, res) => {
        courseHandler.getUserDisplayCourses()
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.post('/courses/registerForCourse/:courseId', passport.authenticate('jwt', {session: false}), (req, res) => {
        courseHandler.registerForCourse(req.params.courseId, req.user.id)
            .then(resolve => {
                res.status(201);
                res.json({'data': 'Successfully registered for this Course'});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/courses/getUserCompleteCourses', passport.authenticate('jwt', {session: false}), (req, res) => {
        courseHandler.getUserCompleteCourses(req.user.id)
            .then(data => {
                console.log(data);
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/courses/getUserIncompleteCourses', passport.authenticate('jwt', {session: false}), (req, res) => {
        courseHandler.getUserIncompleteCourses(req.user.id)
            .then(data => {
                console.log(req.user.id);
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    //************************************************************//

    app.post('/courses', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 2) {
            res.status(401);
            res.json({'error': 'Unauthorized'});
            return;
        }
        courseHandler.addCourse(req.body, req.user.id)
            .then(resolve => {
                res.status(201);
                res.json({'data': 'Successfully added course'});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.put('/courses', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 2) {
            res.status(401);
            res.json({'Error':"Unauthorized"});
        }
        courseHandler.updateCourse(req.body, req.user.id)
            .then(resolve => {
                res.status(200);
                res.json({'data': 'Successfully updated course'});
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

    app.delete('/courses/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 2) {
            res.status(401);
            res.json({'Error':"Unauthorized"});
        }
        courseHandler.deleteCourse(req.params.id, req.user.id)
            .then(resolve => {
                res.status(200);
                res.json({"data": "Successfully deleted course"});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/courses', passport.authenticate('jwt', {session: false}), (req, res) => {
        if(req.user.role != 1) {
            res.status(401);
            res.json({'Error':"Unauthorized"});
        }
        courseHandler.getCourses()
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

    app.get('/courses/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
        courseHandler.getCourseById(req.params.id, req.user.id)
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

};