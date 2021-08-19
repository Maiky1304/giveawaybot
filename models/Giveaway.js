const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    messageId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    prize: {
        type: String,
        required: true
    },
    winners: {
        type: "Number",
        default: 1
    }
});

module.exports = mongoose.model('giveaways', schema);