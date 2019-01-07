/*
    Posts microservice
    CRUD + get all posts by a specified user when logged in and when no log in
    + get a specific post by a specified user
*/ 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../usersreg/User');


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




//get user info based on id
app.get('/user/:id', function(req,res){
    User.find({_id: req.params.id}).select('-password -islogged').then(function(response){
        res.json(response);
    }).catch(function(err){
        if(err)
            throw err;
    });
});

//get user name based on email
app.get('/email/:email', function(req,res){
    User.findOne({ email: req.params.email},function(err,doc){
        res.send(doc.name);
    });

});


//Service is listening to port 1122
app.listen(1122, function(){
    console.log("Service: (User ID) is running...");
});

/*
{
    "email":"4@gmail.com",
    "password":"whatever"
}

{
    "title": "Post again updated",
    "body": "Another post body asdfsadfsadf",
    "image": " "
}

*/