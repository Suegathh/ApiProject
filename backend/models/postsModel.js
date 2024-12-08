const { types } = require('joi')
const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title:{
        type: String,
        required: [true, 'title is required'],
        trim: true,
    },
    description:{
        type: String,
        required: [true, 'description is required'],
        trim: true,
    },
    userId: {
        type: mongoose.Schema.types.ObjectId,
        ref: 'User',
        required: true,
    }
},{
    Timestamp: true
})
module.exports = mongoose.model('Post', postSchema)