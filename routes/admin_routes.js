const express = require("express");
const User = require("../models/user");
const { isAdmin } = require("../middleware/auth_middleware");

const app = express.Router();

// GET all users (Admin Only)
app.get("/admin/users", isAdmin, async (req, res) => {
    try {
        const users = await User.find({});
        res.render("admin_users", { users, message: null, error: null });
    } catch (err) {
        console.error(err);
        res.send("Something went wrong!");
    }
});

// Promote user to admin (Admin Only)
app.post("/admin/make-admin/:id", isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.send("User not found.");
        }

        if (user.role === "admin") {
            return res.send("User is already an admin.");
        }

        user.role = "admin";
        await user.save();
        res.send(`${user.username} is now an admin.`);
    } catch (err) {
        console.error(err);
        res.send("Server error occurred.");
    }
});

// Delete an admin (Ensure at least 1 remains)
app.post("/admin/delete-admin/:id", isAdmin, async (req, res) => {
    try {
        const adminCount = await User.countDocuments({ role: "admin" });

        if (adminCount <= 1) {
            return res.send("At least one admin must remain!");
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.send("User not found.");
        }

        await User.findByIdAndDelete(req.params.id);
        res.send("Admin deleted successfully.");
    } catch (err) {
        console.error(err);
        res.send("Server error occurred.");
    }
});

// Admin Dashboard Route
app.get("/admin", isAdmin, (req, res) => {
    res.render("admin_dashboard", { user: req.user, message: null, error: null });
});

module.exports = app;
