const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    language: {
        type: String
    }
});

module.exports = new mongoose.model('guilds', schema);