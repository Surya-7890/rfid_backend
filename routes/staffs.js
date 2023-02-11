const express = require('express');
const router = express.Router();
const staffRegister = require('../model/staffRegister');
const staffAttendance = require('../model/staffAttendance');
const staffCount = require('../model/staffCount');

router.post('/', async(req,res) => {
    const staff = new staffRegister();
    try {
        staff.name = req.body.name;
        staff.dept = req.body.dept;
        staff.user_id = req.body.id;
        await staff.save();
        res.json({ message: "Success" });
    } catch (error) {
        res.json({ error });
    }
});

router.get('/getattendance', async(req,res) => {
    const data = await staffAttendance.find({}).sort({ createdAt: -1 });
    res.send(data);
});

router.get('/getregister', async(req,res) =>{
    const data = await staffRegister.find({});
    res.send(data);
});

router.get('/entry',async(req,res)=>{
    const data = await staffAttendance.find({ status:"IN" });
    const length = data.length;
    res.json({ message : length });
});

router.get('/exit',async(req,res)=>{
    const data = await staffAttendance.find({ status:"OUT" });
    const length = data.length;
    res.json({ message : length });
});

router.get('/getinfo/:id', async(req,res) => {
    const data = await staffAttendance.find({ user_id: req.params.id });
    res.send(data);
});

router.get('/gettop', async(req,res)=>{
    const data = await staffAttendance.findOne({}).sort({ createdAt: -1 });
    res.send(data);
});

router.get('/downloadData', async (req, res) => {
    const data = await staffAttendance.find({});
    res.send(data);
});

router.get('/incount', async(req, res) => {
    const staff_data = await staffCount.findOne({});
    const total_count = Number(staff_data.inCount) - Number(staff_data.outCount);
    res.json({ message: total_count });
});

module.exports = router;