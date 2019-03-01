/*
    A service to add a new user to the DB
    It uses another service (usercheck) to 
    check if the user already exist in the DB or not
*/
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./User');
var cors = require('cors');         //to handle cors error !!! required in all services

//creating the server
const app = express();

app.use(cors());

//connect to mongodb
mongoose.connect('mongodb://localhost/userregservice',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());



//post request to save a new user
app.post('/newuser', function(req,res){

    var validationport=0;
    var usercheckport=0;

    axios.post('http://localhost:2000/evaluate', { //trust evaluation for validation
    serviceName:"validation",//send the name of the requesting service
    reqPort: "1111" //send the number of the requesting service
    }).then(response => {
        validationport=response.data;
        var validationuri='http://localhost:'+validationport+'/validation/registration'

        //call the (validation) service to check if input fields are fine
        axios.post(validationuri,
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }).then(function (response) {
            if(response.data==1)
                {
                    axios.post('http://localhost:2000/evaluate', { //trust evaluation for validation
                    serviceName:"usercheck",//send the name of the requesting service
                    reqPort: "1111" //send the number of the requesting service
                    }).then(response => {
                        usercheckport=response.data;
                        var usercheckuri='http://localhost:'+usercheckport+'/user/'

                        //call (usercheck) service to check if user already exist or not
                        axios.get(usercheckuri + req.body.email).then(function(response){
                            if(response.data=='1')
                                res.send('User already exists');
                            else    //user doesn't exist so create a new user
                                {

                                    var newUser ={
                                        name: req.body.name,
                                        email: req.body.email,
                                        password: req.body.password
                                    }
                                    var user = new User (newUser);
                                    user.save().then(function(){
                                        res.send('1');
                                    }).catch(function(err){
                                        if(err)
                                            throw err;
                                    });  
        
                                }
                        });

                    });
              
                }
            else
                res.send(response.data);
        })
        .catch(function (error) {
            if(error)
                throw error;
        });
    
    });
    
});


//Service is listening to port 1111
app.listen(1111, function(){
    console.log("Service: (User Registration) is running...");
});

/*
{
    "name":"Whatever the name is",
    "email":"wev@test.con",
    "password":"somepassword"
}
*/



/*

//post request to save a new user
app.post('/newuser', function(req,res){
    //call the (validation) service to check if input fields are fine
    axios.post('http://localhost:1118/validation/registration',
    {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(function (response) {
        if(response.data==1)
            {
                //Checks if the email already exist
                //call (usercheck) service to check
                axios.get('http://localhost:1112/user/' + req.body.email).then(function(response){
                    if(response.data=='1')
                        res.send('User already exists');
                    else    //user doesn't exist so create a new user
                        {
                            axios.post('http://localhost:1120/sprotect/registration').then(function(reply){ //spam protection
                                if(reply.data==1){
                                    var newUser ={
                                        name: req.body.name,
                                        email: req.body.email,
                                        password: req.body.password
                                    }
                                    var user = new User (newUser);
                                    user.save().then(function(){
                                        res.send('1');
                                    }).catch(function(err){
                                        if(err)
                                            throw err;
                                    });  
                                }
                                else
                                    res.send('1');
                            });
 
                        }
                });                
            }
        else
            res.send(response.data);
      })
      .catch(function (error) {
        if(error)
            throw error;
      });

    
});

*/