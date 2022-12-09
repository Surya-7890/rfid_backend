const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    user_name: {
        type: String
    },
    password: {
        type:String
    }
});

module.exports = mongoose.model('Admin',adminSchema);