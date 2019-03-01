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
app.post('/search', function(req,res){
    var validationport=0;
    axios.post('http://localhost:2000/evaluate', { //trust evaluation for validation
    serviceName:"validation",//send the name of the requesting service
    reqPort: "1117" //send port number of the requesting service
    }).then(response => {
        validationport=response.data;
        var validationuri='http://localhost:'+validationport+'/validation/search'

        axios.post(validationuri, //request input validation from (Validation) service
        {                                                     // Validation is not working proberly yet
            term: req.body.term
        }).then(function(response){
    
            if(response.data==1){
                Post.find({body: {'$regex': req.body.term,$options:'i'}}, function(err, posts){
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

});

//Service is listening to port 1117
app.listen(1117, function(){
    console.log("Service: (Search) is running...");
});



/*
{
    "term":"here"
}
*/