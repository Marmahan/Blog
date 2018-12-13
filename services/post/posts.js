/*
    Posts microservice
    So far it has a method to add a new post
*/ 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../usersreg/User');
const jwtVerify = require('express-jwt');
const Post = require('./Post');


//creating the server
const app = express();

//connect to mongodb
mongoose.connect('mongodb://localhost/posts',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());

const secret = 'secret';

//post request to save a new post
//it saves userid as well as the post
//User must have a token to make a post
//jwtVerify({secret:secret}) verifies the token
app.post('/newpost',jwtVerify({secret:secret}), function(req,res){
    //res.send(req);
    //res.send('Allowed to make a post');
    //console.log(req.user.userID);
    var newPost ={
        userID: req.user.userID, //brought from the jwt token
        title: req.body.title,
        body: req.body.body,
        image: req.body.image
    }
     var post = new Post (newPost);
     post.save().then(function(){
        res.send(post);
     }).catch(function(err){
        if(err)
            throw err;
    });    
    
});

//If the user tries to rich a protected route
app.use(function(err, req, res, next){
    if(err.name==='UnauthorizedError'){
        res.status(500).send(err.message);
    }
});


//Service is listening to port 1112
app.listen(1115, function(){
    console.log("Service: (Posts) is running...");
});


