/*
    User model
*/

const mongoose = require('mongoose');


const Relation = mongoose.model('Relation',{
   name :{
       type: String,
       required: true
   },
   port:{
        type: Number,
        required: true
   },
   sid :{
    type: mongoose.Schema.Types.ObjectId,
    required: true
    }, 
    services: { type : Array , "default" : [] }
    // services :
    //     [
    //         { name: String, trust:Number}
    //     ]
});

module.exports = Relation;



