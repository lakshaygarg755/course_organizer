const express = require('express');
const Courses = require('../models/course');
const app = express.Router();

let course_add_flag = 0;
app.get('/courses', async (req, res) => {
    try {
        let data = await Courses.find().lean();
        res.render('course/courses', {
            courses: data,
            user: req.user,  // ✅ Pass the logged-in user object
            flag: course_add_flag,
        });
        course_add_flag = 0;
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


app.post('/courses', async (req,res)=>{
    let data = new Courses({
        "course_id":req.body.course_id,
        "course_name":req.body.course_name,
        "credits":req.body.credits,
        "branch":req.body.branch,
    })
    await data.save();
    course_add_flag = 1;
    res.redirect('/courses');
});

app.get('/courses/add', (req,res)=>{
    res.render('course/add');
})

app.get('/courses/:course_id', async (req, res) => {
    let course = await Courses.findOne({ course_id: req.params.course_id }).lean();

    if (!course) {
        return res.status(404).send("Course not found");
    }

    // Ensure lectures exists and is an array
    if (!course.lectures) {
        course.lectures = [];
    }

    res.render('course/view', { course });
});


app.post('/courses/:course_id', async (req,res) => {
      await Courses.updateOne({"course_id" : req.params.course_id} , {
         "course_name" : req.body.course_name,
         "credits" : req.body.credits,
         "branch" : req.body.branch
        })
        let data = await Courses.findOne({course_id: req.params.course_id});
        let url = "/courses/" + req.params.course_id;
        res.redirect(url);
});

app.get('/courses/:course_id/edit', async (req,res)=> {
    let data = await Courses.findOne({course_id: req.params.course_id});
    res.render('course/edit',{
        course : [data],
    })
});

app.get('/courses/:course_id/delete', async (req,res) => {
    await Courses.deleteOne({"course_id" : req.params.course_id});
    res.redirect('/courses');
})

module.exports = app;{

}