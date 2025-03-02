const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const bodyParser  = require("body-parser");
const courseRoutes = require('./routes/course_routes');

// app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',courseRoutes);

mongoose.connect("mongodb://localhost:27017/course");


app.get('/', (req,res)=> {
    res.sendFile(path.join(__dirname,"index.html"));
})

app.listen(3000,()=> console.log("server started at 3000\n"))