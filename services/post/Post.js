/*
    Post model
*/

const mongoose = require('mongoose');


const Post = mongoose.model('Post',{
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
   date : { 
        type : Date 
        //default: Date.now 
    },
   title :{
       type: String,
       required: true
   },
   body :{
        type: String,
        required: true
    },
    writer:{
        type:String,
    }, 
    imgage: {
        data: Buffer, 
        contentType: String,
        required: false
    }
});

module.exports = Post;



