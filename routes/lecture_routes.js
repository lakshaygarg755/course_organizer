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

    if (req.file) {
        lecture.pdf_url = `/uploads/${req.file.filename}`;
    }

    await course.save();
    res.redirect(`/courses/${req.params.course_id}`);
});


// Delete a lecture
const fs = require('fs'); // File system module to handle file deletion

app.get('/courses/:course_id/lectures/:lecture_id/delete', async (req, res) => {
    try {
        let course = await Courses.findOne({ course_id: req.params.course_id });
        if (!course) return res.status(404).send('Course not found');

        let lecture = course.lectures.id(req.params.lecture_id);
        if (!lecture) return res.status(404).send('Lecture not found');

        // If the lecture has a PDF, delete it from storage
        if (lecture.pdf_url) {
            const filePath = path.join(__dirname, '..', lecture.pdf_url); // Get absolute path
            fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error(`Error deleting file: ${err}`);
                }
            });
        }

        // Remove lecture from the course document
        course.lectures = course.lectures.filter(l => l._id.toString() !== req.params.lecture_id);
        await course.save();

        res.redirect(`/courses/${req.params.course_id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = app;
