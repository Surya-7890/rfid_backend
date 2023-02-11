const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const studentRegister = require('./model/studentRegister');
const studentAttendance = require('./model/studentAttendance');
const studentRoute = require('./routes/students');
const studentCount = require('./model/studentCount');


const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.on('connect', (socket) => {
    console.log(socket.id);
});

const staffRegister = require('./model/staffRegister');
const staffAttendance = require('./model/staffAttendance');
const staffRoute = require('./routes/staffs');
const staffCount = require('./model/staffCount');

const adminRoute = require('./routes/admin');
const totalRoute = require('./routes/total');

const cors = require('cors');
require('dotenv').config();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended:false }));

app.use('/students', studentRoute);
app.use('/staffs', staffRoute);
app.use('/admin', adminRoute);
app.use('/gettotal', totalRoute);

const Port = process.env.PORT || 7000;

mongoose.connect('mongodb://127.0.0.1:27017/RFID',{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open',()=>console.log('Connected to the database'));

server.listen(Port,()=>console.log('server running on port 7000'));

// processing input from id card
app.post('/id', async(req,res) => {
    const id = req.body.id;
    const students = await studentRegister.find({ user_id: id });
    const staffs = await staffRegister.find({ user_id: id });
    if(staffs.length === 0 && students.length === 0){
        io.emit('newId', id );
        res.end()
    } else if (staffs.length > students.length) {
        const date = new Date();
        const staff_attendance = new staffAttendance();
        const find_staff = await staffAttendance.find({ user_id: id });
        const find_staff_count = await staffCount.find({});
        if (find_staff_count.length === 0) {
            await staffCount.create({ inCount: 1, outCount: 0 });
        } else {
            const count_update = await staffCount.findOne({});
            let count;
            ((find_staff.length)%2 === 0)? count =  count_update.inCount + 1 : count = count_update.outCount + 1 ;
            ((find_staff.length)%2 === 0)? await staffCount.updateMany({}, { inCount: count }) : await staffCount.updateMany({}, { outCount: count }) ;
        }
        try {
            staff_attendance.name = staffs[0].name;
            staff_attendance.dept = staffs[0].dept;
            staff_attendance.user_id = staffs[0].user_id;
            const offset = 330 * 60 * 1000;
            const time = new Date( date.getTime() + offset );
            staff_attendance.time = time;
            staff_attendance.time = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
            staff_attendance.date = `${time.getDate()}/${time.getMonth()}`;
            ((find_staff.length)%2 === 0)? staff_attendance.status = "IN" : staff_attendance.status = "OUT";
            await staff_attendance.save();
            ((find_staff.length)%2 === 0)? io.emit('staffEntry', id) : io.emit('staffExit', id) ;
            ((find_staff.length)%2 === 0)? res.json({ message: "Staff Entry Registered" }) : res.json({ message: "Staff Exit Registered" });
        } catch (error) {
            console.log(error);
            res.json({ error });
        }
    } else if (students.length > staffs.length) {
        const date = new Date();
        const student_attendance = new studentAttendance();
        const find_student = await studentAttendance.find({ user_id: id });
        const find_student_count = await studentCount.find({});
        if (find_student_count.length === 0) {
            await studentCount.create({ inCount: 1, outCount: 0 });
        } else {
            const count_update = await studentCount.findOne({});
            let count;
            ((find_student.length)%2 === 0)? count =  count_update.inCount + 1 : count = count_update.outCount + 1 ;
            ((find_student.length)%2 === 0)? await studentCount.updateMany({}, { inCount: count }) : await studentCount.updateMany({}, { outCount: count }) ;
        }
        try {
            student_attendance.name = students[0].name;
            student_attendance.dept = students[0].dept;
            student_attendance.roll = students[0].roll;
            student_attendance.year = students[0].year;
            student_attendance.user_id = students[0].user_id;
            const offset = 330 * 60 * 1000;
            const time = new Date( date.getTime() + offset );
            student_attendance.time = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
            student_attendance.date = `${time.getDate()}/${time.getMonth() + 1}`;
            ((find_student.length)%2 === 0)? student_attendance.status = "IN" : student_attendance.status = "OUT";
            await student_attendance.save();
            ((find_student.length)%2 === 0)? io.emit('studentEntry', id) : io.emit('studentExit', id) ;
            ((find_student.length)%2 === 0)? res.json({ message: "Student Entry Registered" }) : res.json({ message: "Student Exit Registered" });
        } catch (error) {
            console.log(error);
            res.json({ error });
        }
    }
});