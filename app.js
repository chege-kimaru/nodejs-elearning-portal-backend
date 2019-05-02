const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = new express();

const fileUpload = require('express-fileupload');
app.use(fileUpload());

const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const jwt = require('jsonwebtoken');
const userHandler = require('./handler/user');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_OR_KEY
};
const strategy = new JwtStrategy(opts, (payload, next) => {
    userHandler.getUserById(payload.id)
        .then(users => {
            next(null, users[0])
        })
        .catch(err => {
            throw err;
        });
});
passport.use(strategy);
app.use(passport.initialize());

const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:4200'
};
app.use(cors(corsOptions));


//This should not be here. Resesrch more on this
const mkdirp = require('mkdirp');
const fs = require('fs');
const dbUser = require('./handler/user');
app.post('/users/updateProfilePic', passport.authenticate('jwt', {session: false}), (req, res) => {
    if (Object.keys(req.files).length == 0 || !req.files.image) {
        return res.status(400).json({'data': 'No file was uploaded'});
    }
    try {
        const data = req.files.image;
        const userId = req.user.id;

        let imageDir = __dirname + '/uploads/users/' + userId;
        let imageUrl = '/uploads/users/' + userId + '/' + new Date().getTime() + data.name;
        let uploadPath = __dirname + '/uploads/users/' + userId + '/' + new Date().getTime() + data.name;

        const rimraf = require('rimraf');
        mkdirp(imageDir, (err) => {
            rimraf(imageDir + "/*", () => {
                data.mv(uploadPath, async err => {
                    if (err) reject(err);
                    let user = {
                        id: userId,
                        imageUrl: imageUrl
                    };
                    await dbUser.updateImage(user);
                    res.status(200).json({'data': 'Successfully uploaded image.'});
                });
            });
        });
    } catch (err) {
        res.status(500).json({'error': err.message});
        console.error(err);
    }
});
app.get('/users/images', (req, res) => {
    try {
        fs.readFile(__dirname + req.query.imageUrl, (err, content) => {
            if (err) {
                console.error(err);
                return res.status(500).json({'error': err.message});
            } else {
                //specify the content type in the response will be an image
                res.writeHead(200, {'Content-type': 'image/jpg'});
                return res.end(content);
            }
        });
    } catch (err) {
        res.status(500);
        res.json({'error': err.message})
    }
});
const dbCourse = require('./handler/course');
app.post('/courses/updateCoursePic/:courseId', passport.authenticate('jwt', {session: false}), (req, res) => {
    if (Object.keys(req.files).length == 0 || !req.files.image) {
        return res.status(400).json({'error': 'No file was uploaded'});
    }
    if (req.user.role != 2) {
        return res.status(401).json({'error': 'Unauthorized'});
    }
    try {
        const data = req.files.image;
        const courseId = req.params.courseId;
        const userId = req.user.id;

        let imageDir = __dirname + '/uploads/courses/' + courseId;
        let imageUrl = '/uploads/courses/' + courseId + '/' + new Date().getTime() + data.name;
        let uploadPath = __dirname + '/uploads/courses/' + courseId + '/' + new Date().getTime() + data.name;

        const rimraf = require('rimraf');
        mkdirp(imageDir, (err) => {
            rimraf(imageDir + "/*", () => {
                data.mv(uploadPath, async err => {
                    if (err) reject(err);
                    let course = {
                        id: courseId,
                        imageUrl: imageUrl
                    };
                    await dbCourse.updateImage(course, userId);
                    res.status(200).json({'data': 'Successfully uploaded image.'});
                });
            });
        });
    } catch (err) {
        res.status(500).json({'error': err.message});
        console.error(err);
    }
});
app.get('/courses/images', (req, res) => {
    try {
        fs.readFile(__dirname + req.query.imageUrl, (err, content) => {
            if (err) {
                console.error(err);
                return res.status(500).json({'error': err.message});
            } else {
                //specify the content type in the response will be an image
                res.writeHead(200, {'Content-type': 'image/jpg'});
                return res.end(content);
            }
        });
    } catch (err) {
        res.status(500);
        res.json({'error': err.message})
    }
});
//***********************************************************


const userRoutes = require('./controller/user');
userRoutes(app);
const courseRoutes = require('./controller/course');
courseRoutes(app);
const topicRoutes = require('./controller/topic');
topicRoutes(app);
const quizRoutes = require('./controller/quiz');
quizRoutes(app);
const questionRoutes = require('./controller/question');
questionRoutes(app);
const choiceRoutes = require('./controller/choice');
choiceRoutes(app);
const requestRoutes = require('./controller/instructor_request');
requestRoutes(app);
const notificationRoutes = require('./controller/notification');
notificationRoutes(app);
const chatRoutes = require('./controller/chat');
chatRoutes(app);


app.use((err, req, res, next) => {
    res.status(500);
    res.json({error: err.message});
});

//******RUN THIS THE FIRST TIME YOU ARE RUNNING THE APP. ENSURE YOU MANUALLY CREATE THE DATABSE YOURSELEF FIRST******//
const initialize = require('./helper/db_initialize').initialize();

const PORT = process.env.PORT || 3500;

const server = http.createServer(app);

const io = require('socket.io')(server);
const chatHandler = require('./handler/chat');
io.on('connection', socket => {

    socket.on('disconnect', () => {

    });
    socket.on('save-message', async data => {
        try {
            const chat = await chatHandler.addChat(data);
            io.emit('new-message', chat);
        } catch (err) {
            console.error(err);
        }
    });
});

server.listen(PORT);
server.on('listening', () => console.log('App started on port ' + PORT));
