/*
    Comments microservice
    save a comment, get all comments of a specific post
    has its own DB
*/ 

const express = require('express');
const bodyParser = require('body-parser');

const axios = require('axios');
const rateLimit = require("express-rate-limit");

//creating the server
const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes where each 60000 is one minute
    max: 10, // limit each IP to 5 requests per windowMs so the actual number is max/2
    message:
    "Too many requests created from this IP, please try again after 15 mins!",
    statusCode:200  //set it to 200 so the server doesn't stop working  
                    //since the default status code is 429 which is an error
});

//so the app can handle json requests
app.use(bodyParser.json());
 
//  apply to all requests
app.use(limiter);

//get all comments of a specific post
app.post('/sprotect/:service',limiter, function(req,res){
    switch(req.params.service){

        case 'registration': 
            res.send('1');
            break;

        case 'newpost': 
            res.send('1');
            break;

        case 'newcomment': 
            res.send('1');
            break;

        case 'contact': 
            res.send('1');
            break;
        case 'search':
            res.send('1');
            break;
        default:
            res.send('Unknown request');
    }
    
});


//Service is listening to port 1112
app.listen(1120, function(){
    console.log("Service: (Spam Protector) is running...");
});

/*

{
    "postID": "Post again updated",
    "email": "testemail@test.com",
    "commentbody": "This is the first comment"
}

*/