const mongoose = require('mongoose');
const config = require('../config/database');
const User = require('./user');


let commentLengthChecker = (comment) => {
    // Check if comment exists
    if (!comment[0]) {
      return false; // Return error
    } else {
      // Check comment length
      if (comment[0].length < 1 || comment[0].length > 200) {
        return false; // Return error if comment length requirement is not met
      } else {
        return true; // Return comment as valid
      }
    }
  };
  
  // Array of Comment validators
  const commentValidators = [
    // First comment validator
    {
      validator: commentLengthChecker,
      message: 'Comments may not exceed 200 characters.'
    }
  ];

//Projects Schema
const ProjectSchema = mongoose.Schema({
    _author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    author: {
        type: String
    },

    authorUsername: {
        type: String
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
    demoId: {
        type: String,
        required: true
    },
    created_at: {
        type: Date, 
        default: Date.now
    },
    comments: [{
        comment: { type: String, validate: commentValidators },
        commentator: { type: String }
    }],
    rating: {
        aggRating: {
                reviewer: [{                   
                    username: {
                        type:String,
                        default: ''
                    },
                    rated: {
                        type:Number,
                        default: 0
                    }
                }]
        },
        teachRating: {
            type:Number
        },
        githubStars: {
            type: Number
        }
    },
    tags: [{
        type: String
    }],    
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;

module.exports.getProjectById = function(id, callback){
    Project.findById(id, callback);
}

module.exports.getProjectByTitle = function(title, callback){
    const query = {title: title};
    Project.findOne(query, callback);
}
