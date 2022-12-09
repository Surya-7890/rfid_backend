const mongoose = require('mongoose');

const Intermediate = mongoose.Schema({
    user_id: {
        type: String
    }
});

module.exports = mongoose.model('Intermediate',Intermediate);