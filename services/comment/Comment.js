/*
    Comment model
*/

const mongoose = require('mongoose');


const Comment = mongoose.model('Comment',{
    postID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
   time : { 
        type : Date, 
        default: Date.now 
    },
   email :{
       type: String,
       required: true
   },
   commentbody :{
        type: String,
        required: true
    }
});

module.exports = Comment;



