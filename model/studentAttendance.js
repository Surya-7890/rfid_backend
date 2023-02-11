const mongoose = require('mongoose');

const studentAttendanceSchema = mongoose.Schema({
    name: { 
        type: String
    },
    user_id: {
        type: String
    },
    status: {
        type: String
    },
    dept: {
        type: String
    },
    year: {
        type: Number
    },
    roll: {
        type: String
    },
    time: {
        type: String
    },
    date: {
        type: String
    }
});

module.exports =  mongoose.model('studentAttendance', studentAttendanceSchema)