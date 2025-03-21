const mongoose = require("mongoose");

const professorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("professors", professorSchema);