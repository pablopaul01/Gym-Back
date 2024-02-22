const mongoose = require("mongoose");
const Audio = require("./pagoSchema");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    }
}, {timestamps : true});


const User = mongoose.model("User", userSchema);

module.exports = User;