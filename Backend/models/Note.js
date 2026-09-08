const mongoose = require('mongoose')
const noteSchema = new mongoose.Schema({

user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},

title: {
    type: String,
    required: true
},

body: {
    type: String,
    required: true
},

isPublic: {
    type: Boolean,
    default: false
}

}, {timestamps: true})

module.exports = mongoose.model('notes', noteSchema)