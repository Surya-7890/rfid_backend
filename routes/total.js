const express = require('express');
const router = express.Router();
const studentAttendance = require('../model/studentAttendance');
const staffAttendance = require('../model/staffAttendance');

router.get('/entry',async(req,res)=>{
    const data = await studentAttendance.find({ status:"IN" });
    const info = await staffAttendance.find({ status:"IN" });
    const student = data.length;
    const staff = info.length;
    res.json({ message: ( student + staff )});
});

router.get('/exit',async(req,res)=>{
    const data = await studentAttendance.find({ status:"OUT" });
    const info = await staffAttendance.find({ status:"OUT" });
    const student = data.length;
    const staff = info.length;
    res.json({ message: ( student + staff )});
});

module.exports = router;