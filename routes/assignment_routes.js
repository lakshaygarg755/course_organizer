const express = require('express');
const Courses = require('../models/course');
const { cloudinary, upload } = require('../config/cloudinary');

const app = express.Router();

/** ---------- Assignment Routes ---------- **/

// Add an assignment to a course (with PDF upload)
app.post('/courses/:course_id/assignments', upload.single('pdf'), async (req, res) => {
    let course = await Courses.findOne({ course_id: req.params.course_id });
    if (!course) return res.status(404).send('Course not found');

    let newAssignment = {
        title: req.body.title,
        description: req.body.description,
        pdf_url: req.file ? req.file.path : null // Cloudinary URL
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

    // Delete the assignment PDF from Cloudinary
    if (assignment.pdf_url) {
        const publicId = extractPublicId(assignment.pdf_url);
        if (publicId) {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        }
    }

    // Remove assignment from course document
    course.assignments = course.assignments.filter(a => a._id.toString() !== req.params.assignment_id);
    await course.save();

    res.redirect(`/courses/${req.params.course_id}`);
});

// Helper function to extract public_id from Cloudinary URL
function extractPublicId(url) {
    if (!url) return null;
    const matches = url.match(/\/course-organizer\/(.+)$/);
    return matches ? `course-organizer/${matches[1]}` : null;
}

module.exports = app;
