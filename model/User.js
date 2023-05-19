const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
});

module.exports = mongoose.model('User', UserSchema);