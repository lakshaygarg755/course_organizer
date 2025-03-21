const express = require("express");
const User = require("../models/user");
const { isAdmin } = require("../middleware/auth_middleware");

const app = express.Router();

// GET all users (Admin Only)
app.get("/admin/users", isAdmin, async (req, res) => {
    try {
        const users = await User.find({});
        res.render("admin_users", { users, message: req.flash("success"), error: req.flash("error") });
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong!");
        res.redirect("/admin");
    }
});

// Promote user to admin (Admin Only)
app.post("/admin/make-admin/:id", isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/admin/users");
        }

        if (user.role === "admin") {
            req.flash("error", "User is already an admin.");
            return res.redirect("/admin/users");
        }

        user.role = "admin";
        await user.save();
        req.flash("success", `${user.username} is now an admin.`);
        res.redirect("/admin/users");
    } catch (err) {
        console.error(err);
        req.flash("error", "Server error occurred.");
        res.redirect("/admin/users");
    }
});

// Delete an admin (Ensure at least 1 remains)
app.post("/admin/delete-admin/:id", isAdmin, async (req, res) => {
    try {
        const adminCount = await User.countDocuments({ role: "admin" });

        if (adminCount <= 1) {
            req.flash("error", "At least one admin must remain!");
            return res.redirect("/admin/users");
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/admin/users");
        }

        await User.findByIdAndDelete(req.params.id);
        req.flash("success", "Admin deleted successfully.");
        res.redirect("/admin/users");
    } catch (err) {
        console.error(err);
        req.flash("error", "Server error occurred.");
        res.redirect("/admin/users");
    }
});

// Admin Dashboard Route
app.get("/admin", isAdmin, (req, res) => {
    res.render("admin_dashboard", { user: req.user, message: req.flash("success"), error: req.flash("error") });
});

module.exports = app;
