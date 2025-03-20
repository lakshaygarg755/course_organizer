const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    title: String,
    description: String,
    pdf_url: String
});

let lectureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    pdf_url: { type: String }
});

let courseSchema = new mongoose.Schema({
    course_id: { type: String, required: true, },
    course_name: { type: String, required: true },
    credits: { type: Number, required: true },
    branch: { type: String, required: true },
    lectures: [lectureSchema],
    assignments: [AssignmentSchema]
});

let Courses = mongoose.model('Courses', courseSchema);
module.exports = Courses;
