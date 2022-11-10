const { Schema, model } = require('mongoose');
// Moment.js
const moment = require('moment');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "not a valid email address"]
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
    {
        toJSON: {
            virtuals: true,
            id: false
        },
        
    }
);

UserSchema
    .virtual('friendCount').get(function () {
    return this.friends.length;
});

// create the User model using the UserSchema
const User = model('User', UserSchema);


module.exports = User;