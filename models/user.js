const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
    role: { type: String, enum: ["admin", "user"], default: "user" } // Default role is "user"
});

// Creating User model
const User = mongoose.model("users", UserSchema);

module.exports = User;
