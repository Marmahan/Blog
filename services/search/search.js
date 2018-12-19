/*
    Search microservice
    Search the posts for a specific term
    search is case insensitive
*/ 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('../post/Post');
const axios = require('axios');

//creating the server
const app = express();

//connect to mongodb
mongoose.connect('mongodb://localhost/posts',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());

const secret = 'secret';

//post request to search for a term
//search is case insensitive
app.post('/search/:term', function(req,res){
    axios.post('http://localhost:1118/validation/search',
    {   
        term: req.params.term
    }).then(function(response){

        if(response.data==1){
            Post.find({body: {'$regex': req.params.term,$options:'i'}}, function(err, posts){
                if(err)
                  res.send(err);
                else 
                  res.json(posts)   
            });
        }
        else
            res.send(response.data);
    })

});

//Service is listening to port 1117
app.listen(1117, function(){
    console.log("Service: (Search) is running...");
});

