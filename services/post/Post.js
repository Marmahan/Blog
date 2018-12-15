/*
    Post model
*/

const mongoose = require('mongoose');


const Post = mongoose.model('Post',{
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
   time : { 
        type : Date, 
        default: Date.now 
    },
   title :{
       type: String,
       required: true
   },
   body :{
        type: String,
        required: true
    }, 
   imgage: {
        data: Buffer, 
        contentType: String,
        required: false
    }
});

module.exports = Post;



