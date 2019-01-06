/*
    User model
*/

const mongoose = require('mongoose');


const User = mongoose.model('User',{
   name :{
       type: String,
       required: true
   },
   email :{
        type: String,
        required: true
    }, 
    password :{
        type: String,
        required: true
    },
    islogged: {
        type: Boolean,
        default: false
    }
});

module.exports = User;



