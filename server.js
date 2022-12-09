const express = require('express');
const app = express();
const mongoose = require('mongoose');
const studentRegister = require('./model/studentRegister');
const studentAttendance = require('./model/studentAttendance');


const staffRegister = require('./model/staffRegister');
const staffAttendance = require('./model/staffAttendance');

const Intermediate = require('./model/Intermediate');


const Admin = require('./model/admin');

const cors = require('cors');
require('dotenv').config({ path: './.env' });

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended:false }));

const Port = process.env.PORT || 7000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/RFID',{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open',()=>console.log('Connected to the database'));

app.listen(Port);

// getting inputs from client
app.post('/students', async(req,res) => {
    const student = new studentRegister();
    const data = await Intermediate.find({});
    const clear = await Intermediate.deleteMany({});
    try {
        student.name = req.body.name;
        student.year = req.body.year;
        student.roll = req.body.roll;
        student.dept = req.body.dept;
        student.user_id = data[0].user_id;
        await student.save();
        console.log(clear);
        res.json({ message: "Success" });
    } catch (error) {
        console.log(error);
        res.json({message: "Failure"});
    }
});

app.post('/staffs', async(req,res) => {
    const staff = new staffRegister()
    const data = await Intermediate.find({});
    const clear = await Intermediate.deleteMany({});
    try {
        staff.name = req.body.name;
        staff.dept = req.body.dept;
        staff.user_id = data[0].user_id;
        await staff.save();
        console.log(clear);
        res.json({ message: "Success" });
    } catch (error) {
        console.log(error);
        res.json({message: "Failure"});
    }
});

app.post('/admin', async(req,res)=>{
    const data = await Admin.find({});
    const name = req.body.name;
    const password = req.body.password;
    if( name === data[0].user_name  &&  password === data[0].password )
    {
        res.json({message: "Success"});
    } 
    else {
        res.json({message: "Failure"});
    }
})


// processing input from id card
app.get('/id=:id', async(req,res) => {
    const students = await studentRegister.find({ user_id: req.params.id });
    const staffs = await staffRegister.find({ user_id: req.params.id });
    if(staffs.length === 0 && students.length === 0){
        const intermediate = new Intermediate();
        try {
            intermediate.user_id = req.params.id;
            await intermediate.save();
            res.json({ message: "Enter the required credentials" })
        } catch (error) {
            console.log(error);
            res.json({ message: "OOPS.." });
        }
    } else if (staffs.length > students.length) {
        const date = new Date();
        const staff_attendance = new staffAttendance();
        const find_staff = await staffAttendance.find({ user_id: req.params.id });
        try {
            staff_attendance.name = staffs[0].name;
            staff_attendance.dept = staffs[0].dept;
            staff_attendance.user_id = staffs[0].user_id;
            const offset = 330 * 60 * 1000;
            const time = new Date( date.getTime() + offset );
            staff_attendance.time = time;
            staff_attendance.time = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
            staff_attendance.date = `${time.getDate}/${time.getMonth}`;
            ((find_staff.length)%2 === 0)? staff_attendance.status = "IN" : staff_attendance.status = "OUT";
            await staff_attendance.save();
            ((find_staff.length)%2 === 0)? res.json({ message: "Staff Entry Registered" }) : res.json({ message: "Staff Exit Registered" });
        } catch (error) {
            console.log(error);
            res.json({ message: "OOPS.." });
        }
    } else if (students.length > staffs.length) {
        const date = new Date();
        const student_attendance = new studentAttendance();
        const find_student = await studentAttendance.find({ user_id: req.params.id });
        try {
            student_attendance.name = students[0].name;
            student_attendance.dept = students[0].dept;
            student_attendance.roll = students[0].roll;
            student_attendance.year = students[0].year;
            student_attendance.user_id = students[0].user_id;
            const offset = 330 * 60 * 1000;
            const time = new Date( date.getTime() + offset );
            student_attendance.time = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
            student_attendance.date = `${time.getDate}/${time.getMonth}`;
            ((find_student.length)%2 === 0)? student_attendance.status = "IN" : student_attendance.status = "OUT";
            await student_attendance.save();
            ((find_student.length)%2 === 0)? res.json({ message: "Student Entry Registered" }) : res.json({ message: "Student Exit Registered" });
        } catch (error) {
            console.log(error);
            res.json({ message: "OOPS.." });
        }
    }
});


// serving client as an api
app.get('/students/getattendance', async(req,res) => {
    const data =await studentAttendance.find({}).sort({ createdAt: -1 });
    res.send(data);
});

app.get('/students/getregister', async(req,res) =>{
    const data = await studentRegister.find({});
    res.send(data);
})

app.get('/staffs/getattendance', async(req,res) => {
    const data =await staffAttendance.find({}).sort({ createdAt: -1 });
    res.send(data);
});

app.get('/staffs/getregister', async(req,res) =>{
    const data = await staffRegister.find({});
    res.send(data);
});

app.get('/students/entry',async(req,res)=>{
    const data = await studentAttendance.find({ status:"IN" });
    const length = data.length;
    res.json({ message : length });
});

app.get('/students/exit',async(req,res)=>{
    const data = await studentAttendance.find({ status:"OUT" });
    const length = data.length;
    res.json({ message : length });
});

app.get('/staffs/entry',async(req,res)=>{
    const data = await staffAttendance.find({ status:"IN" });
    const length = data.length;
    res.json({ message : length });
});

app.get('/staffs/exit',async(req,res)=>{
    const data = await staffAttendance.find({ status:"OUT" });
    const length = data.length;
    res.json({ message : length });
});

app.get('/getintermediates', async(req,res) => {
    const data = await Intermediate.find({});
    res.send(data);
});

app.get('/student/getinfo/:id', async(req,res) => {
    const data = await studentAttendance.find({ user_id: req.params.id });
    res.send(data);
});

app.get('/staff/getinfo/:id', async(req,res) => {
    const data = await staffAttendance.find({ user_id: req.params.id });
    res.send(data);
});

app.get('/gettotal/entry',async(req,res)=>{
    const data = await studentAttendance.find({ status:"IN" });
    const info = await staffAttendance.find({ status:"IN" });
    const student = data.length;
    const staff = info.length;
    res.json({ message: ( student + staff )});
});

app.get('/gettotal/exit',async(req,res)=>{
    const data = await studentAttendance.find({ status:"OUT" });
    const info = await staffAttendance.find({ status:"OUT" });
    const student = data.length;
    const staff = info.length;
    res.json({ message: ( student + staff )});
});

app.get('/students/gettop', async(req,res)=>{
    const data = await studentAttendance.findOne({}).sort({ createdAt: -1 });
    res.send(data);
});

app.get('/staffs/gettop', async(req,res)=>{
    const data = await staffAttendance.findOne({}).sort({ createdAt: -1 });
    res.send(data);
});

app.post('/admin/changepassword', async(req,res)=>{
    const data = await Admin.findOne({});
    const new_password = req.body.password;
    try {
        data[0].password = new_password;
        res.json({ message: "Success" });
    } catch (error) {
        console.log(error);
    }
})
