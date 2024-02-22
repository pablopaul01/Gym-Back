const mongoose = require('mongoose');
const Audio = require('../models/audioSchema');

const categorySchema = new mongoose.Schema({   
    name: {
        type: String,
        required: true
        },
}, {timestamps: true})

categorySchema.post('remove', { document: true, query: false }, async function (doc) {
    await Audio.updateMany(
        { category: doc._id },
        { $unset: { category: 1 } }
    );
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;