const passport = require('passport');
const AuthorizationError = require('../errors/AuthorizationError');

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 1) {
        res.status(401);
        res.json({'error': 'You are not authorized to perform this operation. Please login as admin.'});
    }
    next();
};

const requireInstructor = (req, res, next) => {
    if (req.user.role !== 1) {
        res.status(401);
        res.json({'error': 'You are not authorized to perform this operation. Please login as instructor.'});
    }
    next();
};

const requireAuth = (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err || !user) {
            res.status(401);
            res.json({'error': 'You are not authorized to perform this operation. Please login.'});
        }
        next();
    });
};

module.exports = {
    requireAuth,
    requireInstructor,
    requireAdmin
};