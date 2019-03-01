/*
    Microservice to send a message to the admins of the Blog
*/ 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Contact = require('./Contact.js');
const axios = require('axios');

var cors = require('cors');         //to handle cors error !!! required in all services

//creating the server
const app = express();

app.use(cors())

//connect to mongodb
mongoose.connect('mongodb://localhost/contactservice',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());


//post request to send a message to the admin
app.post('/contact', function(req,res){
    var duplicationport=0;
    var validationport=0;
    
    axios.post('http://localhost:2000/evaluate', { //trust evaluation for validation
    serviceName:"validation",//send the name of the requesting service
    reqPort: "1113" //send port number of the requesting service
    }).then(response => {
        validationport=response.data;
        var validationuri='http://localhost:'+validationport+'/validation/contact'

        axios.post(validationuri, //request input validation from (Validation) service
        {   
            name: req.body.name,
            email: req.body.email,
            content: req.body.content
            
        }).then(function(response){
            if(response.data==1){
                axios.post('http://localhost:2000/evaluate', { //trust evaluation for duplication
                serviceName:"duplication",//send the name of the requesting service
                reqPort: "1113" //send  port number of the requesting service
                }).then(response => {
                    duplicationport=response.data;
                    var duplicationuri='http://localhost:'+duplicationport+'/duplication/contact'
                    
                    axios.post(duplicationuri, //request duplication check from (Duplication) service
                    {
                        name: req.body.name,
                        email: req.body.email,
                        content: req.body.content
        
                    }).then(function(answer){
                        if(answer.data==1){
                            var newContact ={
                                name: req.body.name,
                                email: req.body.email,
                                content: req.body.content
                            }
                            var contact = new Contact (newContact);
                            contact.save().then(function(){
                                res.send('1');
                            }).catch(function(err){
                                if(err)
                                    throw err;
                            });
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



//Service is listening to port 1113
app.listen(1113, function(){
    console.log("Service: (Contact US) is running...");
});




/*

{
    "name": "Post again updated",
    "email": "Another post body asdfsadfsadf",
    "content": "This is a contact request, this is some message"
}

*/
