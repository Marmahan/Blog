/*
    User model
*/

const mongoose = require('mongoose');


const Service = mongoose.model('Service',{
   name :{
       type: String,
       required: true
   },
   port :{
    type: Number,
    required: true
    },
   source :{
        type: String,
        required: true
    }, 
    sensitivity :{
        type: String,
        required: true
    },
    startdate: {
        type: Date,
        required: true
    },
    lastsuccess: {
        type: Date,
        required: true
    },
    interactions: { //accepted vs rejected
        type: Number,
        required: true
    },
    successful: { //accepted vs rejected
        type: Number,
        required: true
    },
    failed: { //accepted vs rejected
        type: Number,
        required: true
    }

});

module.exports = Service;



