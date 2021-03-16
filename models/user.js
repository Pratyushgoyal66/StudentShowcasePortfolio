const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const crpyto = require('crypto');
const config = require('../config/database');
const Project = require('./project');

//User schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: [{
            type: String,
            enum: ['student', 'teacher', 'university']
        }],
        default: ['student']
    },
    department: {
        type: String,
        required: function (){
            return this.roles === "teacher"
        }
    },
    enrollmentNo: {
        type: Number,
        trim: true,
        unique: true,
        match:[/^\d{10}$/, 'Please fill in a valid Roll No'],
        required: function (){
            return this.roles === "student"
        }
    },
    phoneNo: [{
        type: Number,
        trim: true,
        match: [/^\d{10}$/, 'Please fill a valid telephone number']
    
    }],
    social: {
        github:{
            type: String,
            trim: true,
            match: [/^(http(s?):\/\/)?(www\.)?github\.([a-z])+\/([A-Za-z0-9]{1,})+\/?$/i,'Please fill a valid github profile link']
        },
        linkedIn: {
            type: String,
            trim: true,
            match: [/((http(s?):\/\/)*([www])*\.|[linkedin])[linkedin/~\-]+\.[a-zA-Z0-9/~\-_,&=\?\.;]+[^\.,\s<]/i, 'Please fill a valid Linkedin Profile link']

        },
    },
    projects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}]
})

const User = mongoose.model('User', UserSchema);

module.exports = User;

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username};
    User.findOne(query, callback);
}


module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });

}
