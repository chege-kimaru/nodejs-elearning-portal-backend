const dbCourse = require('../queries/course');
const dbUser = require('../queries/user');
const dbNotification = require('../queries/notification');

exports.addCourse = (course, userId) => {
    course.instructor = userId;
    return dbCourse.addCourse(course);
};

exports.updateCourse = (course, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentCourse = await dbCourse.getCourseById(course.id);
            if(currentCourse[0].instructor != userId) throw new Error("You are not authorized to edit this course.");
            course = {
                "id": course.id,
                "name": course.name,
                "shown": course.shown
            };
            await dbCourse.updateCourse(course);
            resolve();
        }catch(err) {
            reject(err);
        }
    });

};

exports.deleteCourse = (courseId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentCourse = await dbCourse.getCourseById(courseId);
            if(currentCourse[0].instructor != userId) throw new Error("You are not authorized to delete this course.");
            await dbCourse.deleteCourse(courseId);
            resolve();
        }catch(err) {
            reject(err);
        }
    });

};

exports.updateImage = (course, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentCourse = await dbCourse.getCourseById(course.id);
            if(currentCourse[0].instructor != userId) throw new Error("You are not authorized to edit this course.");
            course = {
                "id": course.id,
                "imageUrl": course.imageUrl
            };
            await dbCourse.updateCourse(course);
            resolve();
        }catch(err) {
            reject(err);
        }
    });

};

exports.getCourses = () => {
    return dbCourse.getCourses();
};

exports.getCourseById = (courseId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const courses = await dbCourse.getCourseById(courseId);
            let course = courses[0];
            if (course && course.instructor == userId) course.isInstructor = 1; else course.isInstructor = 0;
            const userCourses = await dbCourse.getUserCourse(courseId, userId);
            let userCourse = userCourses[0];
            course.registered = 0;
            if (userCourse) {
                course.registered = 1;
                course.completed = userCourse && userCourse.isComplete;
                course.marks = userCourse && userCourse.marks;
            }
            resolve(course);
        }catch(err) {
            console.error(err);
            reject(err);
        }
    });
};

//**************************************************//
exports.getUserDisplayCourses = () => {
    return dbCourse.getVerifiedAndShownCourses();
};

exports.registerForCourse = (courseId, userId) => {
    let userCourse = {
        course: courseId,
        user: userId
    };
    return dbCourse.addUserCourse(userCourse);
};

exports.getUserIncompleteCourses = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const userCourses = await dbCourse.getUserIncompleteCourses(userId);
            const data = [];
            for (const userCourse of userCourses) {
                const topicsCount = await dbCourse.countTopicsForCourse(userCourse.course);
                const userTopicsCount = await dbCourse.countUserTopicsForCourse(userCourse.course, userId);
                const progress = (userTopicsCount[0].userTopicsCount) / topicsCount[0].topicsCount * 100;
                console.log('topics count ' + topicsCount[0].topicsCount);
                console.log('user topics count ' + userTopicsCount[0].userTopicsCount);
                console.log('progress ' + progress);

                let single = {};
                const course = await dbCourse.getCourseById(userCourse.course);
                const instructor = await dbUser.getUserById(course[0].instructor);
                single.id = course[0].id;
                single.name = course[0].name;
                single.imageUrl = course[0].imageUrl;
                single.instructorName = `${instructor[0].firstName} ${instructor[0].middleName} ${instructor[0].lastName}`
                single.dateAdded = userCourse.dateAdded;
                single.lastUpdated = userCourse.lastUpdated;
                single.marks = userCourse.marks;
                single.progress = progress;
                data.push(single);
            }
            resolve(data);
        }catch(err) {
            reject(err);
        }
    });
};

exports.getUserCompleteCourses = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userCourses = await dbCourse.getUserCompleteCourses(userId);
            const data = [];
            for (const userCourse of userCourses) {
                let single = {};
                const course = await dbCourse.getCourseById(userCourse.course);
                const instructor = await dbUser.getUserById(course[0].instructor);
                single.id = course[0].id;
                single.imageUrl = course[0].imageUrl;
                single.name = course[0].name;
                single.instructorName = `${instructor[0].firstName} ${instructor[0].middleName} ${instructor[0].lastName}`
                single.dateAdded = userCourse.dateAdded;
                single.lastUpdated = userCourse.lastUpdated;
                single.marks = userCourse.marks;
                data.push(single);
            }
            resolve(data);
        }catch(err) {
            reject(err);
        }
    });
};

exports.getInstructorCourses = (instructorId) => {
    return dbCourse.getInstructorCourses(instructorId);
};

exports.activateCourse = (course) => {
    return new Promise(async (resolve, reject) => {
        try {
            course = {
                "id": course.id,
                "verified": 1
            };
            const currentCourse = await dbCourse.getCourseById(course.id);
            await dbCourse.updateCourse(course);
            const notification = {
                user: currentCourse[0].instructor,
                topic: 'Course Activation',
                details: 'Your course: ' + currentCourse[0].name + ' has been activated. It can now be taken by students.'
            };
            await dbNotification.addNotification(notification);
            resolve();
        }catch(err) {
            console.error(err);
            reject(err);
        }
    });
};

exports.suspendCourse = async (course) => {
    return new Promise(async (resolve, reject) => {
        try {
            course = {
                "id": course.id,
                "verified": 0
            };
            const currentCourse = await dbCourse.getCourseById(course.id);
            await dbCourse.updateCourse(course);
            const notification = {
              user: currentCourse[0].instructor,
              topic: 'Course Suspension',
              details: 'Your course: ' + currentCourse[0].name + ' has been suspended. Please contact admin for more details.'
            };
            await dbNotification.addNotification(notification);
            resolve();
        }catch(err) {
            console.error(err);
            reject(err);
        }
    });
};