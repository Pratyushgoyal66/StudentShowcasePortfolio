const express = require('express');
const config = require('../config/database');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();

//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
        department: req.body.department,
        enrollmentNo: req.body.enrollmentNo,
        phoneNo: req.body.phoneNo
        //social: req.body.social

    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg: 'Failed to register user'});
        }
        else{
            res.json({success: true, msg: 'User Registered!'});
        }
    })
});


module.exports = router;