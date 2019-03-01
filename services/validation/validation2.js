/*
    Microservice to validate inputs
    It validates registering new user, user login, making a new post, 
    making a new comment, sending a contact request, making a search in the posts 
*/ 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { check, validationResult } = require('express-validator/check');
var validator = require("email-validator");
var isempty = require('is-empty');



//creating the server
const app = express();



//so the app can handle json requests
app.use(bodyParser.json());



//post request to validate
app.post('/validation/:service', function(req,res){
    switch(req.params.service){

        case 'registration':    //validate (registration) service
            if(!req.body.name)
                res.send('Name is not valid');
            else if(!validator.validate(req.body.email))
                res.send('Email is not valid');
            else if(!req.body.password)
                res.send('Password is not valid');
            else
                res.send('1');  //everything is fine, all the fields are valid
            break;
        
        case 'login':    //validate (registration) service
            if(!validator.validate(req.body.email))
                res.send('Email is not valid');
            else if(!req.body.password)
                res.send('Password is not valid');
            else
                res.send('1');  //everything is fine, all the fields are valid
            break;

        case 'newpost':    //validate (newpost) service
            if(!req.body.title || Object.keys(req.body.title).length<5)
                res.send('Title is not valid');
            else if(!req.body.body|| Object.keys(req.body.body).length<30)
                res.send('Post  is not valid');
            else
                res.send('1');  //everything is fine, all the fields are valid
            break;

        case 'contact':    //validate (contactus) service
            if(!req.body.name || Object.keys(req.body.name).length<5)
                res.send('Name is not valid');
            else if(!validator.validate(req.body.email))
                res.send('Email is not valid');
            else if(!req.body.content || Object.keys(req.body.content).length<20)
                res.send('Content is not valid');
            else
                res.send('1');  //everything is fine, all the fields are valid
            break;

        case 'newcomment':    //validate (contactus) service
            if(!validator.validate(req.body.email))
                res.send('Email is not valid');
            else if(!req.body.commentbody )
                res.send('Comment is not valid');
            else
                res.send('1');  //everything is fine, all the fields are valid
            break;

        case 'search':// validate the search !!! NOT WORKING !!!
            if(!req.body.term)
                res.send('Search can\'t be empty');
            else
                res.send('1');
            break;

        default:
            res.send('Unknown request');
    }
});


//Service is listening to port 1118
app.listen(2118, function(){
    console.log("Service: (Validation) is running...");
});

