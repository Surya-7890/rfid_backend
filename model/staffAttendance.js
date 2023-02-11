const mongoose = require('mongoose');

const staffAttendanceSchema = mongoose.Schema({
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
    time: {
        type: String
    },
    date: {
        type: String
    }
});

module.exports =  mongoose.model('staffAttendance', staffAttendanceSchema)