const chatHandler = require('../handler/chat');
const passport = require('passport');

module.exports = (app) => {

    app.get('/chats/getChatsForCourse/:courseId', passport.authenticate('jwt', {session: false}), (req, res) => {
        chatHandler.getChatsForCourse(req.params.courseId)
            .then(data => {
                res.status(200);
                res.json(data);
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });


    app.post('/chats', passport.authenticate('jwt', {session: false}), (req, res) => {
        chatHandler.addChat(req.body, req.user.id)
            .then(resolve => {
                res.status(201);
                res.json({'data': 'Successfully added chat'});
            }).catch(err => {
            res.status(500);
            res.json({'error': err.message})
        });
    });

};