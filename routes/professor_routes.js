const express = require("express");
const app = express.Router();
const Professor = require("../models/professor");
const { isAdmin } = require("../middleware/auth_middleware");

// GET: Display all professors
app.get('/professors', isAdmin, async (req, res) => {
    try {
        const professors = await Professor.find().lean();
        res.render('admin/professors', { professors, user: req.user });  // ✅ Pass `user`
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


// POST: Add a new professor
app.post("/admin/professors", isAdmin, async (req, res) => {
    const { name, email } = req.body;
    try {
        const existingProfessor = await Professor.findOne({ email });
        if (existingProfessor) {
            return res.send("Professor with this email already exists.");
        }
        const newProfessor = new Professor({ name, email });
        await newProfessor.save();
        res.redirect("/professors");
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// DELETE: Delete a professor by ID
app.get("/professors/:id/delete", isAdmin, async (req, res) => {
    try {
        await Professor.findByIdAndDelete(req.params.id);
        res.redirect("/professors");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


module.exports = app;