const mongoose = require('mongoose');
const dateFormat = require('../utils/dateFormat');
const { Schema } = mongoose;

const commentSchema = new Schema (
    {
        commentBody: {
            type: String,
            required: true,
            maxLength: 280
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        activity: {
            type: Schema.Types.ObjectId,
            ref: 'Activity'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => dateFormat(timestamp)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;