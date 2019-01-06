/*
    Service to check if user is logged in or not
*/

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../usersreg/User');
const axios = require('axios');


//creating the server
const app = express();




//connect to mongodb
mongoose.connect('mongodb://localhost/userregservice',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());


//sends true if user is logged in, otherwise false
app.get('/islogged', function(req,res){
    User.findOne({ email: req.body.email},function(err,doc){
        console.log(doc);
        res.send(doc.islogged);
    });

});



//Service is listening to port 1121
app.listen(1121, function(){
    console.log("Service: (isLogged) is running...");
});
