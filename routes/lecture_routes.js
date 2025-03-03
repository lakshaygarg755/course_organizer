const express = require('express');
const multer = require('multer');
const path = require('path');
const Courses = require('../models/course');

const app = express.Router();

// Multer Storage for PDF Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Upload PDFs to the 'uploads/' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

/** ---------- Lecture Routes ---------- **/

// Add a lecture to a course (with PDF upload)
app.post('/courses/:course_id/lectures', upload.single('pdf'), async (req, res) => {
    let course = await Courses.findOne({ course_id: req.params.course_id });
    if (!course) return res.status(404).send('Course not found');

    let newLecture = {
        title: req.body.title,
        description: req.body.description,
        video_url: req.body.video_url,
        pdf_url: req.file ? `/uploads/${req.file.filename}` : null // Store file path
    };

    course.lectures.push(newLecture);
    await course.save();
    res.redirect(`/courses/${req.params.course_id}`);
});

// View a specific lecture
app.get('/courses/:course_id/lectures/:lecture_id', async (req, res) => {
    let course = await Courses.findOne({ course_id: req.params.course_id });
    if (!course) return res.status(404).send('Course not found');

    let lecture = course.lectures.id(req.params.lecture_id);
    if (!lecture) return res.status(404).send('Lecture not found');

    res.render('course/lecture_view', { course, lecture });
});

// Edit a lecture (with optional PDF upload)
app.post('/courses/:course_id/lectures/:lecture_id', upload.single('pdf'), async (req, res) => {
    let course = await Courses.findOne({ course_id: req.params.course_id });
    if (!course) return res.status(404).send('Course not found');

    let lecture = course.lectures.id(req.params.lecture_id);
    if (!lecture) return res.status(404).send('Lecture not found');

    lecture.title = req.body.title;
    lecture.description = req.body.description;
    lecture.video_url = req.body.video_url;

    if (req.file) {
        lecture.pdf_url = `/uploads/${req.file.filename}`;
    }

    await course.save();
    res.redirect(`/courses/${req.params.course_id}`);
});

// Delete a lecture
app.get('/courses/:course_id/lectures/:lecture_id/delete', async (req, res) => {
    let course = await Courses.findOne({ course_id: req.params.course_id });
    if (!course) return res.status(404).send('Course not found');

    course.lectures = course.lectures.filter(l => l._id.toString() !== req.params.lecture_id);
    await course.save();

    res.redirect(`/courses/${req.params.course_id}`);
});

module.exports = app;
