/*
    Comments microservice
    save a comment, get all comments of a specific post
    has its own DB
*/ 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Comment = require('./Comment');


//creating the server
const app = express();

//connect to mongodb
mongoose.connect('mongodb://localhost/comments',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());



//post request to save a new comment
app.post('/newcomment', function(req,res){
    //res.send(req);
    //res.send('Allowed to make a post');
    //console.log(req.user.userID);
    var newComment ={
        postID: req.body.postID, //brought from the jwt token
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
    "email":"test@test.com",
    "password":"pwd"
}

{
    "title": "Post again updated",
    "body": "Another post body asdfsadfsadf",
    "image": " "
}

{
    "postID": "Post again updated",
    "email": "testemail@test.com",
    "commentbody": "This is the first comment"
}

*/