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
    axios.post('http://localhost:1118/validation/newcomment', //request input validation from (Validation) service
    {   
        //no need to validate postID because the frontend will always send it 
        email: req.body.email,  
        commentbody: req.body.commentbody
        
    }).then(function(response){
        if(response.data==1){
            axios.post('http://localhost:1119/duplication/newcomment',
            {
                postID:req.body.postID,
                email: req.body.email,  
                commentbody: req.body.commentbody

            }).then(function(answer){
                if(answer.data==1){
                    axios.post('http://localhost:1120/sprotect/newcomment').then(function(reply){
                        if(reply.data==1){
                            var newComment ={
                                postID: mongoose.Types.ObjectId(req.body.postID), 
                                email: req.body.email,
                                commentbody: req.body.commentbody
                            }
                            var comment = new Comment (newComment);
                            comment.save().then(function(){
                                res.send('1');
                            }).catch(function(err){
                                if(err)
                                    throw err;
                            });
                        }
                        else
                            res.send(reply.data);  
                    });
                }
                else
                    res.send(answer.data);
            });
        }
        else
            res.send(response.data);
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

/*
//Error message If the user tries to rich a protected route
app.use(function(err, req, res, next){
    if(err.name==='UnauthorizedError'){
        res.status(500).send(err.message);
    }
}); 
*/

//Service is listening to port 1112
app.listen(1116, function(){
    console.log("Service: (Comments) is running...");
});

/*

{
    "postID": "5c1283f1c212ce117cdf3313",
    "email": "testemail@test.com",
    "commentbody": "This is the first comment"
}

*/