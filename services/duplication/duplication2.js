/*
    Microservice to check for duplicated data
    name: duplication, port 2119
*/ 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('../post/Post');
const Contact = require('../contactus/Contact');
const Comment = require('../comment/Comment');

const { check, validationResult } = require('express-validator/check');
var validator = require("email-validator");
var isempty = require('is-empty');



//creating the server
const app = express();



//so the app can handle json requests
app.use(bodyParser.json());



//post request to validate
app.post('/duplication/:service', function(req,res){
    switch(req.params.service){
        
        case 'newpost':    //check duplication (newpost) service
            //connect to mongodb
            mongoose.connect('mongodb://localhost/posts',{ useNewUrlParser: true });
            mongoose.Promise = global.Promise;

            Post.find({title: req.body.title}).then(function(doc){ //check for title duplication
                if(Object.keys(doc).length<1)
                    {
                        Post.find({body: req.body.body}).then(function(doc){ //check for body duplication
                            if(Object.keys(doc).length<1)
                                res.send('1');
                            else
                                res.send('Duplication Error');
                        });
                    }
                else
                    res.send('Duplication Error');
            });
            break;

        case 'contact':    //duplication check (contactus) service
            //connect to mongodb
            mongoose.connect('mongodb://localhost/contactservice',{ useNewUrlParser: true });
            mongoose.Promise = global.Promise;
            
            Contact.find({content: req.body.content}).then(function(doc){ //check for content duplication
                if(Object.keys(doc).length<1)
                    res.send('1');
                else
                    res.send('Duplication Error');
            });
            break;

        case 'newcomment':    //duplication check (Comment) service

            //connect to mongodb
            mongoose.connect('mongodb://localhost/comments',{ useNewUrlParser: true });
            mongoose.Promise = global.Promise;
            //check for duplicated comments for the same post
            Comment.find({postID: req.body.postID, commentbody: req.body.commentbody}).then(function(doc){ //check for content duplication
                if(Object.keys(doc).length<1)
                    res.send('1');
                else
                    res.send('Duplication Error Comment');
            });
            break;

        default:
            res.send('Unknown request');
    }
});


//Service is listening to port 1119
app.listen(2119, function(){
    console.log("Service: (Duplication, port: 2119) is running...");
});


