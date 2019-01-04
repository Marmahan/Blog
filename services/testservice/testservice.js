/*
    Comments microservice
    save a comment, get all comments of a specific post
    has its own DB
*/ 

const express = require('express');
const bodyParser = require('body-parser');

const axios = require('axios');


//creating the server
const app = express();



//so the app can handle json requests
app.use(bodyParser.json());



//get all comments of a specific post
app.post('/testpost', function(req,res){
    
    axios.post('http://localhost:1120/sprotect', {
        name: "",
        parts: ""
    })
    .then(function(response) { 
        res.send(response.data);
    })
    .catch(error => {
        res.send(error);
    });
    
});



//Service is listening to port 1112
app.listen(2000, function(){
    console.log("Service: (Test) is running...");
});

/*

{
    "postID": "Post again updated",
    "email": "testemail@test.com",
    "commentbody": "This is the first comment"
}

*/