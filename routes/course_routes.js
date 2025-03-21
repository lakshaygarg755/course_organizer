const express = require('express');
const Courses = require('../models/course');
const Professor = require('../models/professor');
const { isAuthenticated, isAdmin } = require('../middleware/auth_middleware');  // ✅ Import middleware

const app = express.Router();

let course_add_flag = 0;

// 🔹 Public Route - Anyone can view courses
app.get('/courses', isAuthenticated, async (req, res) => {
    try {
        let data = await Courses.find().lean();
        res.render('course/courses', {
            courses: data,
            user: req.user,  
            flag: course_add_flag,
        });
        course_add_flag = 0;
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// 🔒 Protected Route - Only Admins can add a course
app.post('/courses', isAdmin, async (req, res) => {
    try {
        const { course_id, course_name, credits, branch, professorEmail } = req.body;

        console.log("Received data:", req.body); 

        const professor = await Professor.findOne({ email: professorEmail });

        if (!professor) {
            console.log("Professor not found in DB!");  
            return res.status(400).send("Professor not found.");
        }

        let data = new Courses({
            course_id,
            course_name,
            credits,
            branch,
            professor_name: professor.name,  
            professor_email: professor.email, 
        });

        await data.save();
        course_add_flag = 1;
        res.redirect('/courses');
    } catch (err) {
        console.error("Error in adding course:", err);
        res.status(500).send("Server Error");
    }
});

// 🔒 Protected Route - Only Admins can access the add course form
app.get('/courses/add', isAdmin, async (req, res) => {
    try {
        const professors = await Professor.find().lean();
        res.render('course/add', { professors });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// 🔹 Public Route - Users can view a single course
app.get('/courses/:course_id', isAuthenticated, async (req, res) => {
    let course = await Courses.findOne({ course_id: req.params.course_id }).lean();

    if (!course) {
        return res.status(404).send("Course not found");
    }

    if (!course.lectures) {
        course.lectures = [];
    }

    res.render('course/view', { course });
});

// 🔒 Protected Route - Only Admins can edit courses
app.post('/courses/:course_id', isAdmin, async (req, res) => {
    await Courses.updateOne({ "course_id": req.params.course_id }, {
        "course_name": req.body.course_name,
        "credits": req.body.credits,
        "branch": req.body.branch
    });

    res.redirect(`/courses/${req.params.course_id}`);
});

// 🔒 Protected Route - Only Admins can access the edit page
app.get('/courses/:course_id/edit', isAdmin, async (req, res) => {
    let data = await Courses.findOne({ course_id: req.params.course_id });
    res.render('course/edit', { course: [data] });
});

// 🔒 Protected Route - Only Admins can delete courses
app.get('/courses/:course_id/delete', isAdmin, async (req, res) => {
    await Courses.deleteOne({ "course_id": req.params.course_id });
    res.redirect('/courses');
});

module.exports = app;
