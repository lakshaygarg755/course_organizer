const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    course_id: { type: String, required: true },
  course_name: { type: String, required: true },
  credits: { type: Number, required: true },
  branch: { type: String, required: true },

});

let Courses = mongoose.model('course_config',schema);

module.exports = Courses;