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
  secret: "yourSecretKey",  // Change this to a strong secret
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/course',  // Use your existing courseDB
      collectionName: 'sessions',  // Optional, default is "sessions"
      ttl: 60 * 60 * 24,  // Session expiry in seconds (24 hours)
  }),
  cookie: {
      maxAge: 1000 * 60 * 60 * 24,  // 24 hours
      httpOnly: true,  
      secure: false,  // Set to `true` if using HTTPS
      sameSite: "lax",
  }
}));


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/course");

// Define Passport Local Strategy
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
    if (!req.session.role) {
        req.session.role = "guest";  // Default role for new visitors
    }
    res.render("index", { user: req.session.user, role: req.session.role });
});

app.get("/guest", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.redirect("/"); // Fallback in case of error
        }
        
        req.session = null; // Reset session to start fresh
        res.redirect("/courses"); // Redirect guest users to courses
    });
});



// Start Server
app.listen(3000, () => console.log("Server started at http://localhost:3000/"));
