const express = require('express');
const Courses = require('../models/course');
const app = express.Router();

app.get('/courses', async (req,res)=>{
    let data = await Courses.find().lean();
    res.render('course/courses',{
        courses:data,
    });
})

app.post('/courses', async (req,res)=>{
    let data = new Courses({
        "course_id":req.body.course_id,
        "course_name":req.body.course_name,
        "credits":req.body.credits,
        "branch":req.body.branch,
    })
    await data.save();
    res.redirect('course/courses');
});

app.get('/courses/add', (req,res)=>{
    res.render('course/add');
})

app.get('/courses/:course_id', async (req,res) => {
    let course = await Courses.findOne({course_id: req.params.course_id});
    course = [course];
    res.render('course/view',{
        course : course,
    })
});

app.post('/courses/:course_id', async (req,res) => {
      await Courses.updateOne({"course_id" : req.params.course_id} , {
         "course_name" : req.body.course_name,
         "credits" : req.body.credits,
         "branch" : req.body.branch
        })
        let data = await Courses.findOne({course_id: req.params.course_id});
        res.render('course/view',{
            course : [data],
        })
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