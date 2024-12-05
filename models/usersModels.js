const { string } = require('joi')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email required'],
        trim: true,
        unique: [true, 'should be unique'],
        minlenght: [5, 'must have 5 characters'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'passwrd must be provided'],
        trim: true,
        select: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationCode:{
        type: String,
        select: false,
    },
    verificationCodeValidation: {
        type: Number,
        select: false,
    },
    forgotPasswordCode:{
        type: String,
        select: false
    },
    forgotPasswordCodeValidation:{
        type: Number,
        select: false
    },
}, {
    timestamp: true
})
module.exports = mongoose.model('User', userSchema)