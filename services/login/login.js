/*
    Microservice to check for a user's login
    If the user has an account a jwt token is sent
    this token must be used with all the requests to restricted routes
    It has an expirey time
*/ 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../usersreg/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

var cors = require('cors');         //to handle cors error !!! required in all services

//creating the server
const app = express();
app.use(cors())

//connect to mongodb
mongoose.connect('mongodb://localhost/userregservice',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());

//Secret for the jwt token
const secret = 'secret';

//post request to save a new user
app.post('/login', function(req,res){

    axios.post('http://localhost:1118/validation/login', //request input validation from (Validation) service
    {   
        email: req.body.email,
        password: req.body.password

    }).then(function(response){
        if(response.data==1){
            //Checks if the email already exist
            User.findOne({ email: req.body.email, password: req.body.password}, function (err, doc){
                if(doc)//user has an account
                    {
                        let expirationDate = Math.floor(Date.now() / 1000) + 10000 //30 sec
                        var token = jwt.sign({userID: doc._id, exp: expirationDate}, secret);
                        //set loggedin true
                        User.findOneAndUpdate({email: req.body.email}, { $set: { islogged: true } },{ new: true }, function(err,doc){ 
                            //console.log(doc);
                            res.send(token);//send jwt token
                        });

                    }
                //email doesn't exist
                else{
                    res.send('Invalid login');
                    }
            });
        }   
        else
            res.send(response.data);
    });
});



//Service is listening to port 1112
app.listen(1114, function(){
    console.log("Service: (Login) is running...");
});