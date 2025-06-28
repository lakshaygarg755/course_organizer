const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const { Strategy } = require("passport-local");
require("dotenv").config();

// Import Routes
const courseRoutes = require("./routes/course_routes");
const lectureRoutes = require("./routes/lecture_routes");
const assignmentRoutes = require("./routes/assignment_routes");
const authRoutes = require("./routes/auth_routes");
const adminRoutes = require('./routes/admin_routes');
const professorRoutes = require('./routes/professor_routes');


// Import User Model
const User = require("./models/user");

// Express App
const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,  
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
      mongoUrl: 'mongodb+srv://arin:arinisgreat@cluster0.cksskgm.mongodb.net/courses',  
      collectionName: 'sessions',  
      ttl: 60 * 60 * 24,  
  }),
  cookie: {
      maxAge: 1000 * 60 * 60 * 24,  
      httpOnly: true,  
      secure: false,  
      sameSite: "lax",
  }
}));


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect("mongodb+srv://arin:arinisgreat@cluster0.cksskgm.mongodb.net/courses");


passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "User not registered" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve uploaded files



// Use Routes
app.use("/", authRoutes);
app.use("/", courseRoutes);
app.use("/", lectureRoutes);
app.use("/", assignmentRoutes);
app.use('/', adminRoutes);
app.use('/',professorRoutes);


// Home Route
app.get("/", (req, res) => {
    res.render("index", { user: req.user, role: req.session.role });
});

// Start Server
app.listen(80, () => console.log("Server started at http://localhost:80/"));