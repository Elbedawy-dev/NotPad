const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({

name: {
    type: String,
    required: true
},

email: {
    type: String,
    required: true,
    unique: true
},

password: {
    type: String,
    required: true
},

avatar: {
    type: String,
    default: "/avatars/1.png"
}

}, {timestamps: true})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const hashedpassword = await bcrypt.hash(this.password, 10);
    this.password = hashedpassword;
})

module.exports = mongoose.model('User', userSchema)