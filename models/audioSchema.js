const mongoose = require("mongoose");
const Category = require("../models/categorySchema");
const User = require("../models/userSchema");


const audioSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    artist: {
        type: String,
        trim: true,
    },
    url: {
        type: String,
        trim: true,
    },
    duration: {
        type: Number,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        trim: true
    }
}, {timestamps : true});

// Middleware para eliminar el ID del audio de la lista de audio de los usuarios
audioSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
        try {
            // Buscar y eliminar el ID del audio de la lista de audio de todos los usuarios
            await this.model('User').updateMany(
                { audioList: this._id },
                { $pull: { audioList: this._id } }
            );
            next();
        } catch (error) {
            next(error);
        }
    });
const Audio = mongoose.model("Audio", audioSchema);

module.exports = Audio;