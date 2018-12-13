/*
    Contact model
*/

const mongoose = require('mongoose');


const Contact = mongoose.model('Contact',{
   name :{
       type: String,
       required: true
   },
   email :{
        type: String,
        required: true
    }, 
    content :{
        type: String,
        required: true
    }
});

module.exports = Contact;



