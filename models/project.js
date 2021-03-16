const mongoose = require('mongoose');
const config = require('../config/database');
const User = require('./user');


//Projects Schema
const ProjectSchema = mongoose.Schema({
    _author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    body: {
        shortDescription: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        workedWith: {
            type: String
        },
        workedUnder: {
            type: String
        },
        inspiration: {
            type: String
        },
        challenges: {
            type: String
        }
    },
    demoUrl: {
        type: String,
        required: true
    },
    repo: {
        type: String,
        required: true
    },
    created_at: {
        type: Date, 
        default: Date.now
    },
    comments: [{body: String, date: Date}],
    date: {
        type: Date,
        default: Date.now
    },
    rating: {
        aggRating: {
            type: Number
        },
        teachRating: {
            type: Number
        },
        githubStars: {
            type: Number
        }
    },
    /*
    tags: {
        type: String
    },    
    */
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
