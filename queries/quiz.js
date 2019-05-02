let pool = require('../helper/db_connection.js');

exports.getQuizes = () => {
    return pool.query('SELECT * FROM quizes');
};

exports.getQuizById = id => {
    return pool.query('SELECT * FROM quizes WHERE id = ?', [id]);
};

exports.addQuiz = (quiz) => {
    return pool.query('INSERT INTO quizes SET ? ', quiz);
};

exports.updateQuiz = (quiz) => {
    return pool.query('UPDATE quizes SET ? WHERE id = ?', [quiz, quiz.id]);
};

exports.deleteQuiz = (id) => {
    return pool.query('DELETE FROM quizes WHERE id = ?', [id]);
};

//********************************************//
exports.getTopicQuizes = (topicId) => {
    return pool.query('SELECT q.*, COUNT(qt.id) AS questionsCount ' +
        'FROM quizes q ' +
        'LEFT JOIN questions qt ' +
        'ON q.id = qt.quiz ' +
        'WHERE q.topic = ? ' +
        'GROUP BY q.id', [topicId]);
};

exports.getUserQuiz = (quizId, userId) => {
    return pool.query('SELECT * FROM user_quizes WHERE quiz = ? AND user = ?', [quizId, userId]);
};

exports.getTopicQuizes = (topicId) => {
    return pool.query('SELECT * FROM quizes WHERE topic = ?', [topicId]);
};


exports.markQuiz = data => {
    return new Promise(async (resolve, reject) => {
        const connection = await pool.getConnection();
        const dataRef = data;
        try {
            //GET user, quiz and answers from client
            const user = dataRef.user;
            const quiz = dataRef.quiz;
            const answers = dataRef.answers;

            const transaction = await connection.beginTransaction();

            //Get this quiz details
            const currentQuizs = await connection.query("SELECT * FROM quizes WHERE id = ?", quiz);
            const currentQuiz = currentQuizs[0];
            const currentTopics = await connection.query("SELECT * FROM topics WHERE id = ?", currentQuiz.topic);
            const currentCourses = await connection.query("SELECT * FROM courses WHERE id = ?", currentTopics[0].course);
            console.log("Current Quiz: ", currentQuiz);

            //Check whether user has already subscribed to this topic. If not subscribe him
            const userTopics = await connection.query("SELECT * FROM user_topics WHERE user = ? AND topic =?", [user, currentQuiz.topic]);
            console.log("User Topic: ", userTopics[0]);
            if (!userTopics[0]) {
                console.log("User not subscribed to this topic. Subscribing......",);
                const userTopic = {user: user, topic: currentQuiz.topic};
                const addUserTopic = await connection.query("INSERT INTO user_topics SET ?", userTopic);
            }

            //Loop through all questions subscribing user to question. and marking as well to get marks and correct answers.
            let marks = 0;
            for (let question of Object.keys(answers)) {
                const choice = answers[question];

                let userQuestion = {};
                userQuestion.user = user;
                userQuestion.question = question;
                userQuestion.choice = choice;
                userQuestion.correct = 0;

                const choiceObj = await connection.query("SELECT * FROM choices WHERE id = ?", choice);
                if (choiceObj[0].isAnswer) {
                    userQuestion.correct = 1;
                    marks++;
                }
                const addUserQuestion = await connection.query("INSERT INTO user_questions SET ?", userQuestion);
            }

            //Get the number of questions for this quiz. This will be used to calculate percentage mark;
            const data = await connection.query('SELECT COUNT(id) AS questionsCount FROM questions WHERE quiz = ?', quiz);
            const questionsCount = data[0].questionsCount;

            const percentageMarks = (marks / questionsCount) * 100;
            console.log("Total Questions: ", questionsCount);
            console.log("Raw Marks: ", marks);
            console.log("Computed Marks: ", percentageMarks);

            const userQuiz = {
                'user': user,
                'quiz': quiz,
                'marks': percentageMarks
            };

            const addUserQuiz = await connection.query("INSERT INTO user_quizes SET ?", [userQuiz]);

            //Check if topic is completed. If so update topic as completed. Check this by getting all compulsory quizes
            //of this topic. If any compulsory quiz has not been done yet, set the topic as incomplete.
            let topicCompleted = 1;
            const mustTopicQuizes = await connection.query("SELECT * FROM quizes WHERE must = 1 AND topic =?", [currentQuiz.topic]);
            for (const quiz of mustTopicQuizes) {
                const userQuiz = await connection.query("SELECT * FROM user_quizes WHERE quiz = ?", [quiz.id]);
                if (!userQuiz[0] || userQuiz[0] == null || userQuiz[0] == undefined) topicCompleted = 0;
            }
            console.log("Topic completed: ", topicCompleted);
            if (topicCompleted) {
                const updateUserTopic = await
                    connection.query("UPDATE user_topics SET isComplete = ? WHERE user=? AND topic=?",
                        [topicCompleted, user, currentQuiz.topic]);

                const topicCompleteNotification = {
                    user: user,
                    topic: 'Topic Completion',
                    details: `Congratulations on completing TOPIC: 
                ${currentTopics[0].title} of COURSE: ${currentCourses[0].name}`
                };
                const addTopicCompleteNotification = await connection.query("INSERT INTO notifications SET ?", topicCompleteNotification);

            }


            //Check if course is completed. If so update user course as completed
            const courseTopics = await connection.query("SELECT * FROM topics WHERE course = ?", currentTopics[0].course);
            console.log("User Topics: ", courseTopics);
            let courseCompleted = 1;
            for (const topic of courseTopics) {
                if (!topic.isComplete) {
                    courseCompleted = 0;
                }
            }
            console.log("Course Completed: ", courseCompleted);
            if (courseCompleted) {
                //Calculate total marks for the course
                let quizCount = 0;
                let courseMarks = 0;
                for (const topic of courseTopics) {
                    const userTopicQuizes = await
                        connection.query("SELECT * FROM user_quizes WHERE user =? AND topic = ?", [user, topic.id]);
                    for (const userQuiz of userTopicQuizes) {
                        quizCount++;
                        courseMarks += userQuiz.marks;
                    }
                }
                const avgCourseMarks = (courseMarks / quizCount);

                const userCourse = {isComplete: courseCompleted, marks: avgCourseMarks};
                const updateUserCourse = await
                    connection.query("UPDATE user_courses SET ? WHERE user = ? AND course = ?", [userCourse, user, currentTopics[0].course]);


                const courseCompleteNotification = {
                    user: user,
                    topic: 'Course Completion',
                    details: `Congratulations on completing the COURSE: ${currentCourses[0].name}. Your total score is ${avgCourseMarks}`
                };
                const addCourseCompleteNotification = await connection.query("INSERT INTO notifications SET ?", courseCompleteNotification);
            }


            const quizCompleteNotification = {
                user: user,
                topic: 'Quiz Completion',
                details: `Congratulations on completing the QUIZ: ${currentQuiz.title} on TOPIC: 
                ${currentTopics[0].title} of COURSE: ${currentCourses[0].name}. 
                Your got ${marks}/${questionsCount}. Percentage of ${percentageMarks}.`
            };
            const addQuizCompleteNotification = await connection.query("INSERT INTO notifications SET ?", quizCompleteNotification);

            const commit = await connection.commit();

            resolve();
        } catch (error) {
            console.error(error);
            const rollback = await connection.rollback();
            const release = await connection.release();
            reject(error);
        }
    });
};

exports.getQuizQuestionsCount = (quizId) => {
    return pool.query('SELECT COUNT(id) AS questionsCount FROM questions WHERE quiz = ?', [quizId]);
};
