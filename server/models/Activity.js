const mongoose = require('mongoose');
const dateFormat = require('../utils/dateFormat');
const { Schema } = mongoose;

const activitySchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            require: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => dateFormat(timestamp)
        },
        tags: [{
            type: Schema.Types.ObjectId,
            ref: 'Tag'
        }],
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        likes: [{
            type: Schema.Types.ObjectId,
            ref: 'Like'
        }]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
);

activitySchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

activitySchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;