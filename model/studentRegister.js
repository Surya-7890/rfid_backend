const mongoose = require('mongoose');

const studentRegisterSchema = mongoose.Schema({
    name:{
        type: String
    },
    user_id: {
        type: String,
    },
    year: {
        type: Number
    },
    roll: {
        type: String
    },
    dept: {
        type: String
    }
});

module.exports = mongoose.model('studentRegister', studentRegisterSchema);