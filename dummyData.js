const Course = require('./models/Course')

const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/learning_platform', {}).then(() => {

    console.log('MongoDB Connected');


    // Create dummy data
    const course = new Course({
        title: 'Week 2 - ',
        description: 'An overview of the course',
        experiments: [
            {
                name: "Experiment 2",
                description: "Experiment to build familiarity with C++",
                dueDate: new Date(2025, 0, 15) 
            }

            
        ],
        students: [
            {
                name: 'John Doe',
                email: 'john.doe@example.com',
                studentID: "202312310101"
            }

        ],
        attendance: [
            {
                date: new Date(),
                status: "Present"
            }

        ],
        worksheets: [
            {
                title: "C Syntax", content: 'Detailed worksheet about C++ syntax', dueDate: new Date(2025, 0, 20)
            }
        ], 
        quizzes: [
            {
                title: "Syntax Quiz", 
                questions: ['What is the syntax for printing to the console in C?'],
                maxScore: 10
            }
        ]
    });

    course.save()
        .then(doc => {
            console.log('Data inserted:', doc);
            mongoose.disconnect();
        })
        .catch(err => {
            console.error('Error inserting data:', err);
            mongoose.disconnect();
        });

}).catch(err => {
    console.error('Database connection error:', err);
});