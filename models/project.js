const mongoose = require('mongoose');
const config = require('../config/database');
const User = require('./user');


//Projects Schema
const ProjectSchema = mongoose.Schema({
    _author: {
        type:String
    },
    title: {
        type: String,
        unique: true,
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
    repo: {
        type: String,
        required: true,
        validate: [/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i,"Please fill in a valid URL!!"]
    },
    demoUrl: {
        type: String,
        required: true
    },
    created_at: {
        type: Date, 
        default: Date.now
    },
    comments: [{body: String, date: Date}],
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

module.exports.getProjectById = function(id, callback){
    Project.findById(id, callback);
}

module.exports.getProjectByTitle = function(username, callback){
    const query = {title: title};
    Project.findOne(query, callback);
}