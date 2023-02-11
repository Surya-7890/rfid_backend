const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../model/admin');

router.post('/add', async(req, res) => {
    const { user_name, password } = req.body;
    try {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async(err, hash) => {
                await Admin.create({ user_name, password: hash });
                res.json({ message: "Success", token: 'loggedIn' });
            });
        });    
    } catch (error) {
        res.json({ error });
    }
});

router.post('/', async(req, res) => {
    const { user_name, password } = req.body;
    const result = await Admin.findOne({ user_name });
    const hash = result.password;
    const compare_result = await bcrypt.compare(password, hash);
    if (compare_result) {
        res.json({ message: "Success" });
    } else {
        res.json({ error })
    }
});

router.post('/admin/changepassword', async(req,res)=>{
    const data = await Admin.findOne({});
    const new_password = req.body.password;
    try {
        data[0].password = new_password;
        res.json({ message: "Success" });
    } catch (error) {
        res.json({ error });
    }
});

module.exports = router;