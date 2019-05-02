const dbUser = require('../queries/user');
const dbCourse = require('../queries/course');
const bcrypt = require('bcrypt-nodejs');

exports.addUser = (user) => {
    user.password = bcrypt.hashSync(user.password);
    return dbUser.addUser(user);
};

exports.updateUser = (user) => {
    user = {
        "id": user.id,
        "firstName": user.firstName,
        "middleName": user.middleName,
        "lastName": user.lastName,
        "idNumber": user.idNumber,
        "address": user.address,
        "addressCode": user.addressCode,
        "city": user.city,
        "phoneNumber": user.phoneNumber
    };
    return dbUser.updateUser(user);
};

exports.updateImage = (user) => {
    user = {
        "id": user.id,
        "imageUrl": user.imageUrl
    };
    return dbUser.updateUser(user);
};

exports.deleteUser = id => {
    return dbUser.deleteUser(id);
};

exports.getUsers = () => {
    return dbUser.getUsers();
};

exports.getUserById = id => {
    return dbUser.getUserById(id);
};

//***************************************************************************//

const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
exports.login = (email, password) => {
    return dbUser.getUserByEmail(email).then(users => {
        if (users.length <= 0)
            throw new AuthorizationError('Wrong credentials.');
        if (!bcrypt.compareSync(password, users[0].password))
            throw new AuthorizationError('Wrong credentials.');
        const payload = {id: users[0].id};
        const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
        users[0].token = token;
        return new Promise((resolve, reject) => resolve(users[0]));
    });
};

exports.getInstructors = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const instructors = await dbUser.getInstructors();
            for(let instructor of instructors) {
                instructor.courses =await dbCourse.getInstructorCourses(instructor.id);
            }
            resolve(instructors);
        }catch(err) {
            reject(err);
        }
    });
};
