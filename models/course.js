const mongoose = require('mongoose');

let lectureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    pdf_url: { type: String } // Stores the file path of uploaded PDFs
});

let courseSchema = new mongoose.Schema({
    course_id: { type: String, required: true, },
    course_name: { type: String, required: true },
    credits: { type: Number, required: true },
    branch: { type: String, required: true },
    lectures: [lectureSchema]
});

let Courses = mongoose.model('Courses', courseSchema);
module.exports = Courses;
