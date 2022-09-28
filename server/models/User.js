const mongoose = require('mongoose');

const { Schema } = mongoose;

const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username.'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please enter Email address.'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profile_image: {
        data: Buffer, 
        contentType: String 
    },
    activities: [{
        type: Schema.Types.ObjectId,
        ref: 'Activity'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Like'
    }]
});

userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

userSchema.methods.isCorrectPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;