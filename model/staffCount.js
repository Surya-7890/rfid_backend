const mongoose = require('mongoose');

const staffCount = mongoose.Schema({
    inCount: {
        type: Number,
        default: 0
    },
    outCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('staffCounts', staffCount);