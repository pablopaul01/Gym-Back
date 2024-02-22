const mongoose = require("mongoose");
const Audio = require("../models/audioSchema");

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
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    whatsapp: {
        type: String
    },
    audioList: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Audio"
        }],
    state: {
        type: Boolean,
        default: true,
    }
}, {timestamps : true});


const User = mongoose.model("User", userSchema);

module.exports = User;