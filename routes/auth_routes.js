const express = require("express");
const app = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user"); // Ensure correct path to User model

const saltRounds = 10;

// GET Register Page
app.get("/register", (req, res) => {
    res.render("auth/register");
});

// GET Login Page
app.get("/login", (req, res) => {
    res.render("auth/login");
});

// POST Register (User Signup)
app.post("/register", async (req, res) => {
    let existingUser = await User.findOne({ username: req.body.username });

    if (!existingUser) {
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            if (err) {
                console.log(err);
                return res.redirect("/register");
            }
            const newUser = new User({ username: req.body.username, password: hash, role: "user" });
            await newUser.save();
            res.redirect("/login");
        });
    } else {
        res.send("User already registered.");
    }
});

// POST Login
app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect("/login");

        req.logIn(user, (err) => {
            if (err) return next(err);

            // Store the user role in the session
            req.session.role = user.role;  // "admin" or "user"
            res.redirect("/courses");
        });
    })(req, res, next);
});


// Logout
app.post('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);  // Handle errors properly
        req.session.destroy(() => {
            res.redirect('/'); 
        });
    });
});


module.exports = app;
