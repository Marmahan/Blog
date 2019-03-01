/*
    Microservice to check if a user exists in the DB or not
    if the user exists a 1 is returned as a string, otherwise 
    0 is returned as a string 
*/ 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../usersreg/User');

//creating the server
const app = express();

//connect to mongodb
mongoose.connect('mongodb://localhost/userregservice',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());


//get request to find a user by email
app.get('/user/:email', function(req,res){
    User.findOne({email:req.params.email}, function(err, doc){
        if(doc)
            res.send('1');
        else
            res.send('0');
    }).catch(function(err){
        if(err)
            throw err;
    });
});

//Service is listening to port 1112
app.listen(1112, function(){
    console.log("Service: (Username Check) is running...");
});