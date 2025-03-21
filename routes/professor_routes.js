const express = require("express");
const app = express.Router();
const Professor = require("../models/professor");
const { isAdmin } = require("../middleware/auth_middleware");

// GET: Display all professors
app.get("/admin/professors", isAdmin, async (req, res) => {
    try {
        const professors = await Professor.find();
        res.render("admin/professors", { professors });
    } catch (err) {
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
        res.redirect("/admin/professors");
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = app;