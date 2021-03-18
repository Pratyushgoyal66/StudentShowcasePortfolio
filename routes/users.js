const express = require('express');
const config = require('../config/database');
const User = require('../models/user');
const Project = require('../models/project');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const mongoose = require('mongoose');

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
            res.json({success: false, msg: 'Failed to register user',err:err});
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

//UserPage
router.get('/:username', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

//Projects
router.get('/:title', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({project: req.project});
});

//Projects Gallery
router.get('/:username/project_gallery', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

//Add Project
router.post('/:username/addProject',  passport.authenticate('jwt', {session:false}), (req, res, next) => {

    const username = req.params.username;

    User.getUserByUsername(username, (err, user) =>{
        if (err) throw err;
        if (!user) {return res.json({success:false, msg: "User not found"})}
        else{
            let newProject = new Project({
                _author: user._id,
                title: req.body.title,
                body: req.body.body,
                demoUrl: req.body.demoUrl,
                repo: req.body.repo
            });
            newProject.save((err, proj) => { 
                if (err){
                    res.send(400, 'Bad Request')
                }
                else{
                    user.projects.push({
                        _id: newProject._id,
                        title: newProject.title
                    });
                    user.save();
                    res.json({success: true});
                }
            });

            
        }

    });
});

module.exports = router;