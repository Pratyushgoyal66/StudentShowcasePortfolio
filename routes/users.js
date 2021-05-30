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

//Projects
router.get('/:username/project/:title', (req, res, next) => {
    Project.getProjectByTitle(req.params.title, (err, project) =>{
        if (err) throw err;
        if (!project) {return res.json({success:false, msg: "Project not found"})}
        else{
            res.json({project: project});
        }
    });
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

//View UserPage
router.get('/view/:username', (req, res, next) => {
    User.getUserByUsername(req.params.username, (err, user) =>{
        if (err) throw err;
        if (!user) {
            return res.json({success:false, msg: "User not found"})}
        else{
            return res.json({user:user});
        }
    });
});



//Projects Gallery
router.get('/:username/projectGallery', (req, res, next) => {
    User.getUserByUsername(req.params.username, (err, user) => {
        var Projects = [];
        if (err) throw err;
        if (!user) {return res.json({success:false, msg: "User not found"})}
        else if(user.role.type !== 'student'){
            res.send("Bad Request, No Project Gallery support for teachers currently")
        }
        else{
            if (user.projects.length === 0){
                res.send("The user has not submitted any projects");
            }
            else{
                Promise.all(user.projects.map(proj =>{
                    return Project.findById({_id: proj._id}).exec();
                })).then(foundProjects => {
                    res.send(foundProjects);
                }).catch(err => {
                    console.log(err);
                });
            }

        }
    } );
});

//Add Project
router.post('/:username/addProject',  passport.authenticate('jwt', {session:false}), (req, res, next) => {
    if (req.user.username != req.params.username){
        res.send("Invalid user");
    }
    else {
        const username = req.params.username;
        User.getUserByUsername(username, (err, user) =>{
            if (err) throw err;
            if (!user) {
                return res.json({success:false, msg: "User not found"})};
            if(user.role.type !== 'student'){
                res.json({success: false, msg: 'Failed to add Project'});
            }
            else{
                let newProject = new Project({
                    _author: user._id,
                    author: user.name,
                    authorUsername: user.username,
                    title: req.body.title,
                    body: req.body.body,
                    demoId: req.body.demoId,
                    repo: req.body.repo
                });
                newProject.save((err, proj) => { 
                    if (err){
                        res.json({success: false, msg: 'Failed to save project',err:err});
                    }
                    else{
                        user.projects.push({
                            _id: newProject._id,
                            title: newProject.title
                        });
                        user.save();
                        res.json({success: true, msg: 'Project Added Successfully'});
                    }
                });

                
            }

        });
    }
});

//Delete Project
router.delete('/:username/project/:title/delete', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    if (req.user.username != req.params.username){
        res.send("Invalid user");
    }
    else{
        Project.getProjectByTitle(req.params.title, (err, project) =>{
            if (err) throw err;
            if (!project) {return res.json({success:false, msg: "Project not found"})}
            else{
                var proj = project;
                Project.findByIdAndDelete(proj._id, (err, docs) => {
                    if(err) throw err;
                    else{
                        User.findByIdAndUpdate(proj._author, { $pull: {'projects': { '_id': proj._id, 'title': proj.title } } }, (err, pro) => {
                            if (err) throw err;
                            else{
                                res.json({deleted: true});
                            }
                        });
                    }
                });
            }
        });
    }

});

//Search
router.post('/search', (req, res, next) => {
    var query = {};

    query.username = new RegExp(req.body.username, 'i');

    User.find(query, (err, docs) => {
        if(err){return res.status(400).send({msg:"error occurred"});}
        if (!docs.length){
            var newQuery = {};
            newQuery.title = new RegExp(req.body.username, 'i');
            Project.find(newQuery, (err, projects) => {
                if(err){return res.status(400).send({msg:"error occurred"});}
                return res.status(200).send(projects);
            });
        }
        else{
            return res.status(200).send(docs);
        }
        
    });

});

module.exports = router;