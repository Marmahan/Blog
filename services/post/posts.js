/*
    Posts microservice
    CRUD + get all posts by a specified user when logged in and when no log in
    + get a specific post by a specified user
*/ 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../usersreg/User');
const jwtVerify = require('express-jwt');
const Post = require('./Post');
const axios = require('axios');
var cors = require('cors');         //to handle cors error !!! required in all services
//creating the server
const app = express();

app.use(cors())

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
    axios.post('http://localhost:1118/validation/newpost', //request input validation from (Validation) service
    {   
        title: req.body.title,
        body: req.body.body
    }).then(function(response){
        if(response.data==1){
            axios.post('http://localhost:1119/duplication/newpost',{
                title: req.body.title,
                body: req.body.body
            }).then(function(answer){ //request to (Duplication) service
                if(answer.data==1){
                    axios.post('http://localhost:1120/sprotect/newpost').then(function(reply){
                        if(reply.data==1){
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

//get a post by a specified user, id must be set to post id, user must be logged in
app.get('/postbyuser/:id',jwtVerify({secret:secret}), function(req,res){
    //req.user.userID is brought from the token
    Post.find({userID: req.user.userID, _id:req.params.id}).then(function(posts){
        res.json(posts);
    }).catch(function(err){
        if(err)
            throw err;
    });
});

//get all posts by a specified user (maybe when unloged user wants to see the posts of a specific writer)
app.get('/usersposts/:id', function(req,res){
    //req.user.userID is brought from the token
    Post.find({userID: req.params.id}).then(function(posts){
        res.json(posts);
    }).catch(function(err){
        if(err)
            throw err;
    });
});

//get a post 
app.get('/post/:id', function(req,res){
    //req.user.userID is brought from the token
    Post.find({_id:req.params.id}).then(function(posts){
        res.json(posts);
    }).catch(function(err){
        if(err)
            throw err;
    });
});

//get all posts by a specified user, user must be logged in (the user see his posts)
app.get('/allposts',jwtVerify({secret:secret}), function(req,res){
    //req.user.userID is brought from the token
    Post.find({userID: req.user.userID}).then(function(posts){
        res.json(posts);
    }).catch(function(err){
        if(err)
            throw err;
    });
});

//get all posts 
app.get('/posts',function(req,res){
    //req.user.userID is brought from the token
    Post.find().then(function(posts){
        res.json(posts);
    }).catch(function(err){
        if(err)
            throw err;
    });
});


//delete a post by id, user must be logged in 
app.delete('/post/:id', jwtVerify({secret:secret}),function(req,res){
    Post.findOneAndRemove({_id: req.params.id}).then(function(){
        res.send('A post has been deleted');
    }).catch(function(err){
        if(err)
            throw err;
    })
});

//update a post by id, user must be logged in 
app.put('/post/:id', jwtVerify({secret:secret}),function(req,res){
    Post.findOneAndUpdate({_id:req.params.id}, { title: req.body.title,body: req.body.body },{ new: true },function(err,data){
       if(data)
            res.send('A post has been updated');
        else
            res.send(err);
    })
});

//Error message If the user tries to rich a protected route
app.use(function(err, req, res, next){
    if(err.name==='UnauthorizedError'){
        res.status(500).send(err.message);
    }
}); 


//Service is listening to port 1112
app.listen(1115, function(){
    console.log("Service: (Posts) is running...");
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