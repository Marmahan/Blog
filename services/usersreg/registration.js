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

app.use(cors())

//connect to mongodb
mongoose.connect('mongodb://localhost/userregservice',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());



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
                                        res.send(user);
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

// //old way with no services from outside
// //post request to save a new user
// app.post('/newuser', function(req,res){
//     // Book.create(req.body).then(function(book){
//     //     res.send(book);
//     // });

//     //Checks if the email already exist
//     User.findOne({ email: req.body.email}, function (err, doc){
//         if(doc)
//             res.send('Email already exist');
//         //email doesn't exist, save the new user
//         else{
//             var newUser ={
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: req.body.password
//             }
//             var user = new User (newUser);
//             user.save().then(function(){
//                 res.send(user);
//             }).catch(function(err){
//                 if(err)
//                     throw err;
//             });
//         }
//       });

// });



//Service is listening to port 1111
app.listen(1111, function(){
    console.log("Service: (User Registration) is running...");
});

