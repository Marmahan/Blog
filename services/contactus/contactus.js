/*
    Microservice to send a message to the admins of the Blog
*/ 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Contact = require('./Contact.js');
const axios = require('axios');

//creating the server
const app = express();

//connect to mongodb
mongoose.connect('mongodb://localhost/contactservice',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());


//post request to send a message to the admin
app.post('/contact', function(req,res){
    axios.post('http://localhost:1118/validation/contact',
    {   
        name: req.body.name,
        email: req.body.email,
        content: req.body.content
        
    }).then(function(response){
        if(response.data==1){
            var newContact ={
                name: req.body.name,
                email: req.body.email,
                content: req.body.content
            }
            var contact = new Contact (newContact);
            contact.save().then(function(){
                res.send(contact);
            }).catch(function(err){
                if(err)
                    throw err;
            });
        }
        else
            res.send(response.data);
    });
});

//Service is listening to port 1113
app.listen(1113, function(){
    console.log("Service: (Contact US) is running...");
});



