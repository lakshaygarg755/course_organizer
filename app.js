const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const courseRoutes = require('./routes/course_routes');
const lectureRoutes = require('./routes/lecture_routes');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use('/', courseRoutes);
app.use('/', lectureRoutes);

mongoose.connect("mongodb://localhost:27017/course");

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => console.log("Server started at 3000"));