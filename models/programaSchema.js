const mongoose = require('mongoose');

const programaSchema = new mongoose.Schema({   
    name: {
        type: String,
        required: true
        },
    price:{
        type: Number,
        required: true
    }
}, {timestamps: true})


const Programa = mongoose.model('Programa', programaSchema);

module.exports = Programa;