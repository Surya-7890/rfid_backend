const express = require('express');
const router = express.Router();
const studentAttendance = require('../model/studentAttendance');
const studentRegister = require('../model/studentRegister');
const studentCount = require('../model/studentCount');

router.post('/', async(req,res) => {
    const student = new studentRegister();
    try {
        student.name = req.body.name;
        student.year = req.body.year;
        student.roll = req.body.roll;
        student.dept = req.body.dept;
        student.user_id = req.body.id;
        await student.save();
        res.json({ message: "Success" });
    } catch (error) {
        res.json({ error });
    }
});

router.get('/getattendance', async(req,res) => {
    const data =await studentAttendance.find({}).sort({ createdAt: -1 });
    res.send(data);
});

router.get('/getregister', async(req,res) =>{
    const data = await studentRegister.find({});
    res.send(data);
});

router.get('/entry',async(req,res)=>{
    const data = await studentAttendance.find({ status:"IN" });
    const length = data.length;
    res.json({ message : length });
});

router.get('/exit',async(req,res)=>{
    const data = await studentAttendance.find({ status:"OUT" });
    const length = data.length;
    res.json({ message : length });
});

router.get('/getinfo/:id', async(req,res) => {
    const data = await studentAttendance.find({ user_id: req.params.id });
    res.send(data);
});

router.get('/gettop', async(req,res)=>{
    const data = await studentAttendance.findOne({}).sort({ createdAt: -1 });
    res.send(data);
});

router.get('/downloadData', async (req, res) => {
    const data = await studentAttendance.find({});
    res.send(data);
});

router.get('/incount', async(req, res) => {
    const student_data = await studentCount.findOne({});
    const total_count = Number(student_data.inCount) - Number(student_data.outCount);
    res.json({ message: total_count });
});


module.exports = router;