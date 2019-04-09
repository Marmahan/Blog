/*
    Comments microservice
    save a comment, get all comments of a specific post
    has its own DB
*/ 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Comment = require('./Comment');
const axios = require('axios');
var cors = require('cors');         //to handle cors error !!! required in all services
var async = require("async");


//creating the server
const app = express();
app.use(cors());

//connect to mongodb
mongoose.connect('mongodb://localhost/comments',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());


//post request to save a new comment
app.post('/newcomment', function(req,res){
    var duplicationport=0;
    var validationport=0;
    axios.post('http://localhost:2000/evaluate', { //trust evaluation for validation
    serviceName:"validation",//send the name of the requesting service
    reqPort: "1116" //send the number of the requesting service
    }).then(response => {
        validationport=response.data;
        var validationuri='http://localhost:'+validationport+'/validation/newcomment'

        axios.post(validationuri, //request input validation from (Validation) service
        {   
            //no need to validate postID because the frontend will always send it 
            email: req.body.email,  
            commentbody: req.body.commentbody
            
        }).then(function(response){
            if(response.data==1){
                axios.post('http://localhost:2000/evaluate', { //trust evaluation for duplication
                serviceName:"duplication",//send the name of the requesting service
                reqPort: "1116" //send the port of the requesting service
                }).then(response => {
                    duplicationport=response.data;
                    var duplicationuri='http://localhost:'+duplicationport+'/duplication/newcomment'

                    axios.post(duplicationuri, //duplication check
                    {
                        postID:req.body.postID,
                        email: req.body.email,  
                        commentbody: req.body.commentbody
        
                    }).then(function(answer){ //save the comment to the database
                        if(answer.data==1){

                                    var newComment ={
                                        postID: mongoose.Types.ObjectId(req.body.postID), 
                                        email: req.body.email,
                                        commentbody: req.body.commentbody
                                    }
                                    var comment = new Comment (newComment);
                                    comment.save().then(function(){
                                        res.send(comment);
                                    }).catch(function(err){
                                        if(err)
                                            throw err;
                                    });
                                    res.send('1');
                        }
                        else
                            res.send(answer.data);
                    });
                });
            }
            else
                res.send(response.data);
        });
    });

});
               

//get all comments of a specific post
app.get('/comments/:id', function(req,res){
    //req.user.userID is brought from the token
    Comment.find({postID: req.params.id}, function(err, comments){
        if(err)
            res.status(402).send('No Comments yet');
        else
            res.json(comments);
    });
});




//Service is listening to port 1116
app.listen(1116, function(){
    console.log("Service: (Comments) is running...");
});

