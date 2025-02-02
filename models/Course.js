const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const experimentSchema = new Schema({
    name: String,
    description: String,
    dueDate: Date
});


const studentSchema = new Schema({
    name: String,
    email: String,
    studentId: String
});

const attendanceSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    date: Date,
    status: String
});

const worksheetSchema = new Schema({
    title: String,
    content: String,
    dueDate: Date
});


const quizSchema = new Schema({

    title: String,
    questions: [String],
    maxScore: Number
});


const courseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    experiemnts: [experimentSchema],
    students: [studentSchema],
    attendance: [attendanceSchema],
    worksheets: [worksheetSchema],
    quizes: [quizSchema]

});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;