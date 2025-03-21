const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Courses = require('../models/course');

const app = express.Router();

// Multer Storage for Assignment PDF Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/assignments/');  // ✅ Correct path
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

/** ---------- Assignment Routes ---------- **/

// Add an assignment to a course (with PDF upload)
app.post('/courses/:course_id/assignments', upload.single('pdf'), async (req, res) => {
    let course = await Courses.findOne({ course_id: req.params.course_id });
    if (!course) return res.status(404).send('Course not found');

    let newAssignment = {
        title: req.body.title,
        description: req.body.description,
        pdf_url: req.file ? `/uploads/assignments/${req.file.filename}` : null // ✅ Correct URL format
    };

    course.assignments.push(newAssignment);
    await course.save();
    res.redirect(`/courses/${req.params.course_id}`);
});

// Delete an assignment
app.get('/courses/:course_id/assignments/:assignment_id/delete', async (req, res) => {
    let course = await Courses.findOne({ course_id: req.params.course_id });
    if (!course) return res.status(404).send('Course not found');

    let assignment = course.assignments.id(req.params.assignment_id);
    if (!assignment) return res.status(404).send('Assignment not found');

    // Delete the assignment PDF from storage
    if (assignment.pdf_url) {
        const filePath = path.join(__dirname, '..', assignment.pdf_url);
        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') {
                console.error(`Error deleting file: ${err}`);
            }
        });
    }

    // Remove assignment from course document
    course.assignments = course.assignments.filter(a => a._id.toString() !== req.params.assignment_id);
    await course.save();

    res.redirect(`/courses/${req.params.course_id}`);
});

module.exports = app;
