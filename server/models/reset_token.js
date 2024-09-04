const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // Set the token to expire after 1 hour
        expires: 3600 
    }
});

module.exports = mongoose.model('ResetToken', resetTokenSchema);
