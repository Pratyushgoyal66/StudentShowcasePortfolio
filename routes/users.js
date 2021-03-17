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
        phoneNo: req.body.phoneNo,
        social: req.body.social

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

//Authenticate
router.post('/authenticate', (req, res, next) =>{
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) =>{
        if (err) throw err;
        if (!user) {return res.json({success:false, msg: "User not found"});}

        User.comparePassword(password, user.password, (err, isMatch) =>{
            if (err) throw err;
            if(isMatch){
                const token = jwt.sign({user}, config.secret, {
                    expiresIn: 604800
                });
            
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            }else{
                return res.json({success:false, msg: "Wrong Password"});
            }

        });
    });
});

//Profile
router.get('/:username', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

//Projects


//Projects Gallery
router.get('/:username/project_gallery', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

//Add Project

module.exports = router;