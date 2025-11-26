const express = require('express');
const Courses = require('../models/course');
const { cloudinary, upload } = require('../config/cloudinary');

const app = express.Router();

/** ---------- Lecture Routes ---------- **/

// Add a lecture to a course (with PDF upload)
app.post('/courses/:course_id/lectures', upload.single('pdf'), async (req, res) => {
    let course = await Courses.findOne({ course_id: req.params.course_id });
    if (!course) return res.status(404).send('Course not found');

    let newLecture = {
        title: req.body.title,
        description: req.body.description,
        pdf_url: req.file ? req.file.path : null // Cloudinary URL
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
        // Delete old file from Cloudinary if it exists
        if (lecture.pdf_url) {
            const publicId = extractPublicId(lecture.pdf_url);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
            }
        }
        lecture.pdf_url = req.file.path; // New Cloudinary URL
    }

    await course.save();
    res.redirect(`/courses/${req.params.course_id}`);
});


// Delete a lecture
app.get('/courses/:course_id/lectures/:lecture_id/delete', async (req, res) => {
    try {
        let course = await Courses.findOne({ course_id: req.params.course_id });
        if (!course) return res.status(404).send('Course not found');

        let lecture = course.lectures.id(req.params.lecture_id);
        if (!lecture) return res.status(404).send('Lecture not found');

        // Delete PDF from Cloudinary if it exists
        if (lecture.pdf_url) {
            const publicId = extractPublicId(lecture.pdf_url);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
            }
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

// Helper function to extract public_id from Cloudinary URL
function extractPublicId(url) {
    if (!url) return null;
    const matches = url.match(/\/course-organizer\/(.+)$/);
    return matches ? `course-organizer/${matches[1]}` : null;
}

module.exports = app;
