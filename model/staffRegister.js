const mongoose = require('mongoose');

const staffRegisterSchema = mongoose.Schema({
    name:{
        type: String
    },
    user_id: {
        type: String,
    },
    dept: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('staffRegister', staffRegisterSchema);