const mongoose = require('mongoose');
const { Schema } = mongoose;

const likeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    activity: {
        type: Schema.Types.ObjectId,
        ref: 'Activity'
    }
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;