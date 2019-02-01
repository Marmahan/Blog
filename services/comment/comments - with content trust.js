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

const Service = require('../servicesdb/Service');//content trust
const Relation = require('../servicesdb/Relation');//content trust

//creating the server
const app = express();
app.use(cors());

//connect to mongodb
//mongoose.connect('mongodb://localhost/comments',{ useNewUrlParser: true });
//mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/trust',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());

//store services names and ports
var svs= new Array();
var sdata= new Array();
var selfPort=1116;// the port of the comment service so it can recognize its direct trust
//post request to save a new comment
app.post('/newcomment', function(req,res){


    Service.find({name: "duplication"}, function(err, services){
        if(err)
            res.status(402).send('No duplications found');
        else
            {
                //stores all the names and ports for services that have the name "duplication"
                for( var i in services){
                    svs.push({port:services[i].port,name:services[i].name});
                }

                //console.log(services.length)
                res.json(services);
            }
            var index=Math.floor(Math.random() * svs.length);//choose a service randomly

            //get the data of the service from the Service collection
            Service.findOne({port: svs[index].port}, function(err, data){
                if(err)
                    {
                        console.log('Error retrieving the rest of the data');
                        return;
                    }
                else{//store the data in an array
                    sdata.push({_id:data._id,name:data.name, port:data.port, source:data.source,
                        sensitivity:data.sensitivity, startdate:data.startdate, 
                        lastsuccess:data.lastsuccess, interactions:data.interactions, 
                        successful:data.successful, failed:data.failed});

                        //get how much direct trust and indirect trust this service has
                        //basically get the data from the "Relation" collection
                        Relation.findOne({sid:sdata[0]._id}, function(err, retn){
                            if(err)
                                {
                                    console.log('Error retrieving the relation data');
                                    return;
                                }
                            else{
                                var v=0;
                                 for(v=0;v< retn.services.length;v++){
                                     var key="trust"+v;
                                     if(retn.services[v].port==selfPort)//if the port matchs the port of the service 
                                        key="strust" //then this is the direct trust value
                                     sdata.push({[key]:retn.services[v].trust})
                                 }
                                 //now the data is not organized well
                                 //store everything as a single object in the array of objects
                                 acc={}
                                 acc=sdata.reduce(function(acc, x) {
                                    for (var key in x) acc[key] = x[key];
                                    return acc;
                                }, {});
                                console.log(acc);
                                //now calculate the trust evaluation
                            }
                        })
                }
            })
            //for( var i in svs){
                //console.log(svs[index]);
            //}
    });

    /////////////////////////////

    /*
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
*/
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

//Service is listening to port 1116
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